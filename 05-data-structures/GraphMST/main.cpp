/*
*************************************************************
 Author : Phuriphat Malison
 Code : 66172110157-8
 Author : Nawadon Srikhao
 Code : 66172110221-4
 Author : Chotiphat Suwannawong
 Code : 66172110328-3
 Section : CPE.66241B
 Lab : Graph
 Course : 04-061-212 Data Structures and Algorithms Laboratory
 Instruction : Supattra Kerdmec
*************************************************************
*/
#include <iostream>
#include <vector>
#include <queue>
#include <sstream>
#include <climits>
using namespace std;

struct Edge {
    int u, v, weight;
    Edge(int u, int v, int weight) : u(u), v(v), weight(weight) {}
};

struct Compare {
    bool operator()(const Edge& e1, const Edge& e2) {
        return e1.weight > e2.weight;
    }
};

vector<Edge> findMST(int n, const vector<Edge>& edges, int startNode) {
    vector<vector<Edge>> graph(n);
    for (const auto& edge : edges) {
        graph[edge.u].emplace_back(edge.u, edge.v, edge.weight);
        graph[edge.v].emplace_back(edge.v, edge.u, edge.weight);
    }

    vector<Edge> mst;
    vector<bool> visited(n, false);
    priority_queue<Edge, vector<Edge>, Compare> minHeap;
    minHeap.emplace(-1, startNode, 0);

    while (!minHeap.empty()) {
        Edge edge = minHeap.top();
        minHeap.pop();

        int u = edge.v;
        if (visited[u]) continue;
        visited[u] = true;
        if (edge.u != -1) {
            mst.push_back(edge);
        }

        for (const auto& adj : graph[u]) {
            if (!visited[adj.v]) {
                minHeap.push(adj);
            }
        }
    }

    return mst;
}

int main() {
    int n, m;

    if (!(cin >> n >> m) || n <= 0 || m <= 0) {
        exit(0);
    }

    vector<Edge> edges;

    for (int i = 0; i < m; ++i) {
        string inputLine;
        getline(cin >> ws, inputLine);

        stringstream ss(inputLine);
        int u, v, weight;

        if (!(ss >> u >> v >> weight) || !ss.eof() || weight <= 0) {
            exit(0);
        }

        edges.emplace_back(u, v, weight);
    }

    int startNode;

    if (!(cin >> startNode)) {
        exit(0);
    }

    vector<Edge> mst = findMST(n, edges, startNode);

    int totalWeight = 0;

    for (const auto& edge : mst) {
        int u = edge.u;
        int v = edge.v;

        cout << u << " -> " << v << endl;
        totalWeight += edge.weight;
    }

    cout << totalWeight << endl;

    return 0;
}
