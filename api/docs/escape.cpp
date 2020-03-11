#include <stdio.h>
#include <iostream>
#include <vector>
#define INF 2000000500
#define enqueue(a) Q[ed++]=a
#define dequeue() be++
using namespace std;

vector<int> G[100050];
vector<double> W[100050];
int Q[100050]={0},be=0,ed=0;
int par[100050]={0};
double wei[100050]={0};
int num[100050]={0};
int input[100050][3];
int n,m,s,t;

void print(int u)
{
    if(u==s) printf("%d ",s);
    else
    {
        print(par[u]);
        printf("%d ",u);
    }
}
int main()
{
    int a,b,c,stop=INF;
    scanf("%d%d",&n,&m);
    scanf("%d%d",&s,&t);
    for(int i=0;i<m;i++)
    {
        scanf("%d%d%d",&a,&b,&c);
        input[i][0] = a;
        input[i][1] = b;
        input[i][2] = c;
        G[a].push_back(b);
        W[a].push_back(1-(c/100.0));
        G[b].push_back(a);
        W[b].push_back(1-(c/100.0));
    }
    enqueue(s);
    num[s]=wei[s]=1;
    while(be!=ed)
    {
        int u=Q[be];
        int siz=G[u].size();
        if(u==t||num[u]>=stop) {dequeue();continue;}
        for(int i=0;i<siz;i++)
        {
            int v=G[u][i];
            if(v==t&&stop==INF) stop=num[u]+1;
            if(num[v]==0)
            {
                par[v]=u;
                wei[v]=W[u][i]*wei[u];
                num[v]=num[u]+1;
                enqueue(v);
            }
            else if(num[u]+1==num[v]&&W[u][i]*wei[u]>wei[v])
            {
                par[v]=u;
                wei[v]=W[u][i]*wei[u];
            }
        }
        dequeue();
    }
    //printf("%d %.2lf\n",stop,mn);
    printf("%d %.6lf\n", stop, 1-wei[t]);
    //print(t);
    cout << n << " " << m << endl;
    for(int i = 0; i < m; i++){
        printf("%d %d %d\n", input[i][0], input[i][1], input[i][2]);
    }
    return 0;
}
