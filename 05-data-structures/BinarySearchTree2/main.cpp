/*
*************************************************************
 Author : Phuriphat Malison
 Code : 66172110157-8
 Author : Nawadon Srikhao
 Code : 66172110221-4
 Author : Chotiphat Suwannawong
 Code : 66172110328-3
 Section : CPE.66241B
 Lab : Binary Search Tree
 Course : 04-061-212 Data Structures and Algorithms Laboratory
 Instruction : Supattra Kerdmec
*************************************************************
*/


#include <iostream>
#include <stdlib.h>
using namespace std;

struct node{
    int data;
    struct node *l;
    struct node *r;
};
node *root = NULL ,*temp = NULL ,*t1, *t2 , *s = NULL;
int countNode = 0;

void insert(int dataIn){

    temp = (node*)malloc(sizeof(node));
    temp->data = dataIn;
    temp->l = temp->r = NULL;
    if(root == NULL){
        root = temp;
    }else{
        t1 = root;
        t2 = NULL;

        while(t1 != NULL){
            t2 = t1;
            if(temp->data >= t1->data){
                t1 = t1->r;
            }else{
                t1 = t1->l;
            }

        }
        if(temp->data > t2->data){
            t2->r = temp;
        }else{
            t2->l = temp;
        }
    }
}

void inorder(node *i){
    if(root == NULL){
        return;
    }else{
        if(i->l != NULL) inorder(i->l);
        cout << i -> data << " ";
        if(i->r != NULL) inorder(i->r);
    }
}
void preorder(node *p){
    if(root == NULL){
        return;
    }else{
        cout << p->data << " ";
        if(p->l != NULL ) preorder(p->l);
        if(p->r != NULL ) preorder(p->r);

}
}
void postorder(node *p){
    if(root == NULL){
        return;
    }else{
        if(p->l != NULL) postorder(p->l);
        if(p->r != NULL) postorder(p->r);
        cout << p->data << " ";
    }

}

void traverse(){
    if(root == NULL){
        cout << "no" << endl;
    }else{
        preorder(root);
        cout << endl;
        inorder(root);
        cout << endl;
        postorder(root);
        cout << endl;
    }
}

void remove(int delData) {
    if (root == NULL) {
        return;
    } else if (s == NULL) {
        s = root;
    }

    node* parent = NULL;
    while (s != NULL) {
        if (delData > s->data) {
            parent = s;
            s = s->r;
        } else if (delData < s->data) {
            parent = s;
            s = s->l;
        } else if (delData == s->data) {


            if (s->l == NULL && s->r == NULL) {
                if (parent == NULL) {
                    root = NULL;
                } else if (parent->l == s) {
                    parent->l = NULL;
                } else {
                    parent->r = NULL;
                }
                delete s;
            }

            else if (s->r == NULL) {
                if (parent == NULL) {
                    root = s->l;
                } else if (parent->l == s) {
                    parent->l = s->l;
                } else {
                    parent->r = s->l;
                }
                delete s;
            }

            else if (s->l == NULL) {
                if (parent == NULL) {
                    root = s->r;
                } else if (parent->l == s) {
                    parent->l = s->r;
                } else {
                    parent->r = s->r;
                }
                delete s;
            }

            else {
                node* suc = s->r;
                node* sucPar = s;

            while(suc->l != NULL){
                sucPar = suc;
                suc = suc->l;
            }
            s->data = suc->data;

            if(sucPar->l == suc) {
                sucPar->l = suc->r;
            } else{
                sucPar->r = suc->r;
            }
            delete suc;
            }
            s = NULL;
        }
    }
}





void search(int data){
    if(s == NULL){
        s = root;
    }

    while(s != NULL){
        if(data > s->data){
            s = s->r;
        }else if(data < s->data){
            s = s->l;
        }else if(data == s->data){
            cout << "yes" << endl;
            s = NULL;
            return;
        }
    }
    cout << "no" << endl;
    s = NULL;
}


void getSize(node *c){
    if(c == NULL){
        if(countNode == 0){
            cout << "0" << endl;
        }
        return;
    }
    countNode++;
    getSize(c->l);
    getSize(c->r);

    if(c == root){
        cout << countNode << endl;
        countNode = 0;
    }
}

void getMaxMin(node *m){
    node *n = m;
    if(m == NULL){
        cout << "no" << endl;
        return;
    }

    while(m->r != NULL){
        m = m->r;
    }

    int max = m->data;

    while(n->l != NULL){
        n = n-> l;
    }
    int min = n->data;

    cout << "Min = " << min<<" and Max = " << max;
    cout << endl;
}



int main()
{
    do{
        int number;
        int data;
        cin >> number;
        switch(number){
            case 1 : cin >> data;
                     insert(data);
                     break;
            case 2 : cin >> data;
                     remove(data);
                     break;
            case 3 : cin >> data;
                     search(data);
                     break;
            case 4 : getSize(root);
                     break;
            case 5 : getMaxMin(root);
                     break;
            case 6 : traverse();
                     break;
            case 7 : exit(0);
        }
    }while(true);
}
