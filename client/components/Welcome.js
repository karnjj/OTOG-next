const Welcome = () => {
    return (
        <div>
            <h4 className="text-center"> <code className="font_gray">สวัสดี admin</code></h4>
            <ul className="d-flex justify-content-center flex-wrap p-0 list-unstyled">
                <li><div className="count_button black select-none">
                    <h5 className="font_white cnt_msg">ทั้งหมด</h5>
                    <code className="font_white cnt_num">0</code>
                </div>
                </li>
                <li><div className="count_button green select-none">
                    <h5 className="font_white cnt_msg">ผ่านแล้ว</h5>
                    <code className="font_white cnt_num">0</code>
                </div>
                </li>
                <li><div className="count_button red select-none">
                    <h5 className="font_white cnt_msg">ยังไม่ผ่าน</h5>
                    <code className="font_white cnt_num">0</code>
                </div>
                </li>
                <li><div className="count_button org select-none">
                    <h5 className="font_white cnt_msg">ยังไม่ส่ง </h5>
                    <code className="font_white cnt_num">0</code>
                </div>
                </li>
                <li><div className="count_button blue select-none">
                    <h5 className="font_white cnt_msg">โจทย์วันนี้</h5>
                    <code className="font_white cnt_num">0</code>
                </div>
                </li>
            </ul>
            <h6 className="font_gray text-center"><b>ยังมีชีวิตรอด</b> : 0</h6>
        </div>
    )
}
export default Welcome