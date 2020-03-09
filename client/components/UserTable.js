export default function UserTable(props) {
    return (
        <div className="table-responsive">
            <table className="table table-hover">
                <thead>
                    <tr id='coltable'>
                        <th >#</th>
                        <th >Name</th>
                        <th >Rating</th>
                        <th >Passed</th>
                    </tr>
                </thead>
                <tbody>
                    {props.user.map((user,index) => (
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{user.sname}</td>
                            <td>{user.rating}</td>
                            <td>0</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <style jsx>{`
                table {
                    text-align: center;
                }
                #coltable {
                    color: #FF851B;
                }
                `}</style>
        </div>
    )
}