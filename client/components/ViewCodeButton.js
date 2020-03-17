import { useState, useEffect } from 'react'

import { Modal } from 'react-bootstrap'
import OrangeButton from './OrangeButton'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode } from '@fortawesome/free-solid-svg-icons'
import prism from 'prismjs'

const ViewCodeButton = (props) => {
    const { language, code } = {language:'cpp', code: CodeTextTest, ...props}
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)
    useEffect(() => {
        if (show) {
            prism.highlightAll()
        }
    }, [show])
    
    return (
        <>
            <OrangeButton outline='true' onClick={handleShow}>
                <FontAwesomeIcon icon={faCode}/>
            </OrangeButton>
            
            <Modal show={show} onHide={handleClose} centered size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Submission : {69420}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <pre className='line-numbers'>
                        <code className={`language-${language}`}>
                            {code}
                        </code>
                    </pre>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ViewCodeButton

const CodeTextTest = 
`#include <bits/stdc++.h>
using namespace std;
const int mxn = 15;
char arr[mxn][mxn];
bool flag[mxn][mxn];

int di[] = {0, 1, 0,-1};
int dj[] = {1, 0,-1, 0};
int n, m;
map<char,int> mp;
bool bound(int i, int j) {
    return i >= 0 && j >=0 && i<n && j<m;
}
int dfs(int i, int j ,int h) {
    if(h == 0)
        return 0;
    if(i == n-1 && j == m-1)
        return h;
    flag[i][j] = true;
    int mx = 0;
    for(int d=0; d<4; d++) {
        int ni = i + di[d];
        int nj = j + dj[d];
        if(bound(ni, nj) and not flag[ni][nj]) {
            int nh = h + mp[arr[ni][nj]];
            mx = max(mx, dfs(ni, nj, nh));
        }
    }
    flag[i][j] = false;
    return mx;
}

int main() {
    cin >> n >> m;
    for(int i=0; i<n; i++) {
        for(int j=0; j<m; j++) {
            cin >> arr[i][j];
        }
    }
    mp['E'] = 0, mp['X'] = -1, mp['*'] = 1;
    cout << dfs(0, 0, 3);
}`