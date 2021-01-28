import os
import signal
import time
import subprocess
import codecs
import mysql.connector

print("*****Grader started*****")
mydb = mysql.connector.connect(
    host="localhost", user="root", passwd="0000", database="OTOG"
)
IO_REDIRECT = " 0<env/input.txt 1>env/output.txt 2>env/error.txt"
LANG_ARGS = {
    "C": {
        "extension": "c",
        "system": "find /usr/bin/ -name gcc",
        "compile": f"gcc ../uploaded/[userID]/[codeFileName].c -O2 -fomit-frame-pointer -o compiled/[codeFileName]{IO_REDIRECT}",
        "execute": "compiled/[exeName][inputFile]",
    },
    "C++": {
        "extension": "cpp",
        "system": "find /usr/bin/ -name g++",
        "compile": f"g++ ../uploaded/[userID]/[codeFileName].cpp -O2 -fomit-frame-pointer -o compiled/[codeFileName]{IO_REDIRECT}",
        "execute": "compiled/[exeName][inputFile]",
    },
}

ERROR_MSG = {
    124: "Time Limit Exceeded - Process killed.",
    134: "SIGSEGV||Segmentation fault (core dumped)\n",
    136: "SIGFPE||Floating point exception\n",
    139: "SIGABRT||Aborted\n",
}


def file_read(filename):
    if not os.path.exists(filename):
        return ""
    with codecs.open(filename, "r", "utf-8") as f:
        return f.read().replace("\r", "")


def file_write(filename, data):
    with codecs.open(filename, "w", "utf-8") as f:
        f.write(data.replace("\r", ""))


# Program Compiled
def create(fileName, userID, language):
    os.system("chmod 777 compiled/" + fileName)
    os.system("rm compiled/" + fileName)
    if language not in ("C", "C++"):
        return

    print("Compiling Code File ...")

    compilecmd = LANG_ARGS[language]["compile"]
    compilecmd = compilecmd.replace("[codeFileName]", fileName)
    compilecmd = compilecmd.replace("[userID]", userID)
    os.system(compilecmd)

    result = None
    if not os.path.exists("compiled/" + fileName):
        result = "Compilation Error"

    if result == None:
        print("Code File Compiled to Executable.")
    else:
        print("Compilation Error")
    return result


# Program Execution
def execute(language, probName, idProb, testcase, timeLimit, memLimit, uploadTime):
    exeName = f"{idProb}_{uploadTime}"
    inputFile = f" <source/{probName}/{testcase}.in 1>env/output.txt 2?env/error.txt"

    cmd = f"ulimit -v {memLimit}; {LANG_ARGS[language]['execute']}; exit;"
    cmd = cmd.replace("[exeName]", exeName)
    cmd = cmd.replace("[inputFile]", inputFile)

    os.system("chmod 777 .")
    if os.path.exists("env/error.txt"):
        os.system("chmod 777 env/error.txt")
    if os.path.exists("env/output.txt"):
        os.system("chmod 777 env/output.txt")

    startTime = time.time()
    proc = subprocess.Popen([cmd], shell=True, preexec_fn=os.setsid)
    try:
        proc.communicate(timeout=timeLimit)
        t = proc.returncode
    except subprocess.TimeoutExpired:
        t = 124

    timeDiff = time.time() - startTime  # Increase accuracy.
    os.system("chmod 777 .")
    if os.path.exists("/proc/" + str(proc.pid)):
        os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
    return t, timeDiff


def cmpfunc(fname1, fname2):
    with open(fname1) as f1, open(fname2) as f2:
        while True:
            f1_line = f1.readline()
            f2_line = f2.readline()
            if f1_line == "" and f2_line == "":
                return True
            if f1_line.rstrip() != f2_line.rstrip():
                return False


while True:
    mycursor = mydb.cursor(buffered=True)
    mycursor.execute("SELECT * FROM Result WHERE status = 0 ORDER BY time")
    submission = mycursor.fetchone()
    if submission != None:
        print("====================================")
        print(submission[:4])

        uploadTime = str(submission[1])
        userID = str(submission[2])
        idProb = str(submission[3])
        contestMode = submission[9]
        fileLang = submission[10]

        mycursor.execute(f"SELECT * FROM Problem WHERE id_Prob = {idProb}")
        probInfo = mycursor.fetchone()

        probName = str(probInfo[2])
        timeLimit = float(probInfo[4])
        memLimit = int(probInfo[5])

        cnt = 0
        ans = ""
        perfect = True
        sumTime = 0
        lastTest = 0

        result = create(f"{idProb}_{uploadTime}", userID, fileLang)

        if os.path.exists(f"source/{probName}/script.php"):
            case = file_read(f"source/{probName}/script.php")

            # Remove maximum case number and improve structure.
            idxBegin = case.find("cases = ")
            idxEnd = case.find(";")
            testcase = int(case[idxBegin:idxEnd])
            print("Testcase : " + testcase)
        else:
            testcase = "-1"
            result = "No Testcases."
        if probInfo[8] and contestMode:
            subtask = probInfo[8].split(" ")
        else:
            subtask = [testcase]
        if result == None:
            for sub in subtask:
                if contestMode:
                    ans += "["
                if perfect == False:
                    for x in range(lastTest, int(sub)):
                        ans += "S"
                    if contestMode:
                        ans += "]"
                    lastTest = int(sub)
                    continue
                for x in range(lastTest, int(sub)):
                    result = None
                    t, timeDiff = execute(
                        fileLang,
                        probName,
                        idProb,
                        str(x + 1),
                        timeLimit,
                        memLimit * 1024,
                        uploadTime,
                    )
                    userResult = "env/output.txt"
                    solution = f"source/{probName}/{x + 1}.sol"
                    if t != 0:
                        if t in ERROR_MSG.keys():
                            file_write(
                                "env/error.txt",
                                ERROR_MSG[t] + file_read("env/error.txt")
                                if t != 124
                                else "",
                            )
                            if t == 124:
                                result = "TLE"
                        else:
                            file_write(
                                "env/error.txt",
                                f"NZEC||return code : {str(t)}\n{file_read('env/error.txt')}",
                            )
                    sumTime += timeDiff
                    if result == None and t == 0:
                        if cmpfunc(userResult, solution):
                            ans += "P"
                            cnt += 1
                        else:
                            perfect = False
                            ans += "-"
                    elif result == "TLE":
                        ans += "T"
                        perfect = False
                    else:
                        ans += "X"
                        perfect = False
                    sql = "UPDATE Result SET result = %s WHERE idResult = %s"
                    val = (f"Running in testcase {x+1}", submission[0])
                    mycursor.execute(sql, val)
                    mydb.commit()
                if contestMode:
                    ans += "]"
                lastTest = int(sub)
        else:
            ans = result
        print(ans)
        try:
            errMsg = file_read("env/error.txt")
        except:
            errMsg = "Something wrong."
        print(f"Time : {sumTime}")
        score = (cnt / int(testcase)) * 100

        sql = "UPDATE Result SET result = %s, score = %s, timeuse = %s, status = 1, errmsg = %s WHERE idResult = %s"
        val = (ans, score, round(sumTime, 2), errMsg, submission[0])
        mycursor.execute(sql, val)
        mydb.commit()
    mydb.commit()
    time.sleep(1)
