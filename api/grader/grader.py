import os
import signal
import time
import subprocess
import codecs
import mysql.connector

print("*****Grader started*****")
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="0000",
    database="OTOG"
)
ioeredirect = " 0<env/input.txt 1>env/output.txt 2>env/error.txt"
langarr = {
    "C": {"extension": "c", "system": "find /usr/bin/ -name gcc", "compile": "gcc ../uploaded/[idUser]/[codefilename].c -O2 -fomit-frame-pointer -o compiled/[codefilename]" + ioeredirect, "execute": "compiled/[exename][inputfile]"},
    "C++": {"extension": "cpp", "system": "find /usr/bin/ -name g++", "compile": "g++ ../uploaded/[idUser]/[codefilename].cpp -O2 -fomit-frame-pointer -o compiled/[codefilename]" + ioeredirect, "execute": "compiled/[exename][inputfile]"}
}


def file_read(filename):
    if not os.path.exists(filename):
        return ""
    f = codecs.open(filename, "r", "utf-8")
    d = f.read()
    f.close()
    return d.replace("\r", "")


def file_write(filename, data):
    f = codecs.open(filename, "w", "utf-8")
    f.write(data.replace("\r", ""))
    f.close()

# Program Compiled


def create(fileName, idUser, language):
    os.system("chmod 777 compiled/" + fileName)
    os.system("rm compiled/" + fileName)
    if(language not in ('C', 'C++')):
        return
    print("Compiling Code File ...")
    result = None
    compilecmd = langarr[language]["compile"]
    compilecmd = compilecmd.replace("[codefilename]", fileName)
    compilecmd = compilecmd.replace("[idUser]", idUser)
    os.system(compilecmd)
    if not os.path.exists("compiled/" + fileName):
        result = "Compilation Error"

    if result == None:
        print("Code File Compiled to Executable.")
    else:
        print("Compilation Error")
    return result

# Program Execution


def execute(language, idUser, probName, idProb, testcase, timelimit, memlimit, uploadTime):
    exename = idProb + "_" + uploadTime
    global timediff
    inputfile = " <source/" + probName + "/" + \
        testcase + ".in 1>env/output.txt 2>env/error.txt"
    cmd = "ulimit -v " + str(memlimit) + ";" + \
        langarr[language]["execute"] + "; exit;"
    cmd = cmd.replace("[exename]", exename)
    cmd = cmd.replace("[inputfile]", inputfile)
    os.system("chmod 777 .")
    if(os.path.exists("env/error.txt")):
        os.system("chmod 777 env/error.txt")
    if(os.path.exists("env/output.txt")):
        os.system("chmod 777 env/output.txt")
    starttime = time.time()
    proc = subprocess.Popen([cmd], shell=True, preexec_fn=os.setsid)
    try:
        proc.communicate(timeout=timelimit)
        t = proc.returncode
    except subprocess.TimeoutExpired:
        t = 124
    endtime = time.time()
    timediff = endtime - starttime
    os.system("chmod 777 .")
    if(os.path.exists("/proc/"+str(proc.pid))):
        os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
    return t


def cmpfunc(fname1, fname2):
    f1 = open(fname1)
    f2 = open(fname2)
    f1_line = f1.readline()
    f2_line = f2.readline()
    while f1_line != '' or f2_line != '':
        f1_line = f1_line.rstrip()
        f2_line = f2_line.rstrip()
        if f1_line != f2_line:
            f1.close()
            f2.close()
            return False
        f1_line = f1.readline()
        f2_line = f2.readline()
    f1.close()
    f2.close()
    return True


while True:
    mycursor = mydb.cursor(buffered=True)
    mycursor.execute("SELECT * FROM Result WHERE status = 0 ORDER BY time")
    submission = mycursor.fetchone()
    if(submission != None):
        print('====================================')
        tmp = []
        for i in range(4):
            tmp.append(submission[i])
        print(tmp)
        mycursor.execute(
            "SELECT * FROM Problem WHERE id_Prob = " + str(submission[3]))
        probInfo = mycursor.fetchone()
        cnt = 0
        ans = ""
        perfect = True
        sumtime = 0
        lastTest = 0
        result = None
        uploadTime = str(submission[1])
        idUser = str(submission[2])
        idProb = str(submission[3])
        contestMode = submission[9]
        fileLang = submission[10]
        probName = str(probInfo[2])
        time_limit = float(probInfo[4])
        mem_limit = int(probInfo[5])
        result = create(idProb + "_" + uploadTime, idUser, fileLang)
        if(os.path.exists("source/" + probName + "/script.php")):
            case = file_read("source/" + probName + "/script.php")
            idx = case.find("cases = ")
            testcase = ''
            testcase = testcase + case[idx + 8]
            if(case[idx + 9] != ';'):
                testcase = testcase + case[idx + 9]
            print("Testcase : " + testcase)
        else:
            testcase = '-1'
            result = "No Testcases."
        if probInfo[8] and contestMode : subtask = probInfo[8].split(' ')
        else : subtask = [testcase]
        if(result == None):
            for sub in subtask:
                if contestMode : ans = ans + '['
                if perfect == False:
                    for x in range(lastTest, int(sub)):
                        ans = ans + 'S'
                    if contestMode : ans = ans + ']'
                    lastTest = int(sub)
                    continue
                for x in range(lastTest, int(sub)):
                    result = None
                    t = execute(fileLang, idUser, probName, idProb,
                                str(x + 1), time_limit, mem_limit*1024, uploadTime)
                    result_user = "env/output.txt"
                    result_src = "source/" + probName + \
                        "/" + str(x + 1) + ".sol"
                    timetaken = 0
                    if t == 124:
                        result = "TLE"
                        file_write('env/error.txt',
                                   "Time Limit Exceeded - Process killed.")
                        timetaken = timediff
                    elif t == 139:
                        file_write(
                            'env/error.txt', 'SIGSEGV||Segmentation fault (core dumped)\n' + file_read("env/error.txt"))
                        timetaken = timediff
                    elif t == 136:
                        file_write(
                            'env/error.txt', 'SIGFPE||Floating point exception\n' + file_read("env/error.txt"))
                        timetaken = timediff
                    elif t == 134:
                        file_write('env/error.txt', 'SIGABRT||Aborted\n' +
                                   file_read("env/error.txt"))
                        timetaken = timediff
                    elif t != 0:
                        file_write('env/error.txt', 'NZEC||return code : ' +
                                   str(t) + "\n" + file_read("env/error.txt"))
                        timetaken = timediff
                    else:
                        timetaken = timediff
                    sumtime = sumtime + timetaken
                    if(result == None and t == 0):
                        if(cmpfunc(result_user, result_src)):
                            ans = ans + 'P'
                            cnt = cnt + 1
                        else:
                            perfect = False
                            ans = ans + '-'
                    elif(result == 'TLE'):
                        ans = ans + 'T'
                        perfect = False
                    else:
                        ans = ans + 'X'
                        perfect = False
                    sql = "UPDATE Result SET result = %s WHERE idResult = %s"
                    val = ('Running in testcase ' + str(x+1), submission[0])
                    mycursor.execute(sql, val)
                    mydb.commit()
                if contestMode : ans = ans + ']'
                lastTest = int(sub)
        else:
            ans = result
        print(ans)
        try:
            errmsg = file_read("env/error.txt")
        except:
            errmsg = "Something wrong."
        print("TIME : " + str(sumtime))
        score = (cnt / int(testcase)) * 100
        sql = "UPDATE Result SET result = %s, score = %s, timeuse = %s, status = 1, errmsg = %s WHERE idResult = %s"
        val = (ans, score, round(sumtime, 2), errmsg, submission[0])
        mycursor.execute(sql, val)
        mydb.commit()
    mydb.commit()
    time.sleep(1)
