#include <iostream>
#include <stdlib.h>
using namespace std;
struct node{
    struct node *prev;
    int n;
    struct node *next;
}

*h, *temp, *temp1, *temp2, *temp4,*trav,*des;
void insert1();
void insert2();
void insert3();
void traversebeg();
void search();
void del();
void destroy();
int count1 = 0;
void count();

int main(){
int ch;
h = NULL;
temp = temp1 = NULL;
cout << endl << " 1 - Insert at beginning";
cout << endl << " 2 - Insert at end";
cout << endl << " 3 - Insert at position i";
cout << endl << " 4 - Delete at i";
cout << endl << " 5 - Display from beginning";
cout << endl << " 6 - Search for element";
cout << endl << " 7 – Count of List";
cout << endl << " 8 – Destroy";
cout << endl << " 9 - Exit";
while (1){
    cout << endl << " Enter choice : ";
    cin >> ch;
    switch (ch){
        case 1: insert1();
        break;
        case 2: insert2();
        break;
        case 3: insert3();
        break;
        case 4: del();
        break;
        case 5: traversebeg();
        break;
        case 6: search();
        break;
        case 7: count();
        break;
        case 8: destroy();
        break;
        case 9: exit(0);
        default: cout << endl << " Wrong choice menu";
        }
    }
}
/* TO create an empty node */
void create(){
    int data;
    temp = (struct node *)malloc(1 * sizeof(struct node));
    temp->prev = NULL;
    temp->next = NULL;
    cout << endl << " Enter value to node : ";
    cin >> data;
    temp->n = data;
    count1++;
}

/* TO insert at beginning */
void insert1(){
    if (h == NULL){
        create();
        h = temp;
        temp1 = h;
    }else{
        create();
        temp->next = h;
        h->prev = temp;
        h = temp;
    }
}
/* To insert at end */
void insert2(){
    if (h == NULL){
        create();
        h = temp;
        temp1 = h;
    }
    else{
        create();
        temp1->next = temp;
        temp->prev = temp1;
        temp1 = temp;
    }
}
/* To insert at any position */
void insert3()
{
    int pos, i = 2;
    cout << endl << " Enter position to be inserted : ";
    cin >> pos;
    temp2 = h;
    if ((pos < 1) || (pos >= count1 + 1)){
        cout << endl << " Position out of range to insert";
        return;
    }
    if ((h == NULL) && (pos != 1)){
        cout << endl << " Empty list cannot insert other than 1st position";
        return;
    }
    if ((h == NULL) && (pos == 1)){
        create();
        h = temp;
        temp1 = h;
        return;
    }
    else{
        while (i < pos){
            temp2 = temp2->next;
            i++;
        }
        create();
        temp->prev = temp2;
        temp->next = temp2->next;
        temp2->next->prev = temp;
        temp2->next = temp;
    }
}
/* To delete an element */
void del(){
    int i = 1, pos;
    cout << endl << " Enter position to be deleted : ";
    cin >> pos;
    temp2 = h;
    if ((pos < 1) || (pos >= count1 + 1)){
        cout << endl << " Error : Position out of range to delete";
        return;
    }
    if (h == NULL){
//Empty List
        return;
    }
    else{
        while (i < pos){
            temp2 = temp2->next;
            i++;
        }
        if (i == 1){
            if (temp2->next == NULL){
                cout << "Node deleted from list";
                free(temp2);
                temp2 = h = NULL;
                return;
            }
        }
        if (temp2->next == NULL){
            temp2->prev->next = NULL;
            free(temp2);
            cout << "Node deleted from list";
            return;
        }
        temp2->next->prev = temp2->prev;
        if (i != 1)
            temp2->prev->next = temp2->next; /* Might not need this statement if i == 1 check */
        if (i == 1)
            h = temp2->next;
        cout << endl << " Node deleted";
        free(temp2);
    }
    count1--;
}
/* Traverse from beginning */
void traversebeg(){
    temp2 = h;
    if (temp2 == NULL){
        //Empty List
        return;
    }
    cout << endl << " Linked list elements from begining : ";
    while (temp2->next != NULL){
        cout << temp2->n;
        cout << " ";
        temp2 = temp2->next;
    }
    cout << temp2->n;
}
/* To search for an element in the list */
void search(){
    int data, count1 = 0;
    temp2 = h;
    if (temp2 == NULL){
    //Empty List
        return;
    }
    cout << endl << " Enter value to search : ";
    cin >> data;
    while (temp2 != NULL){
        if (temp2->n == data){
            cout << endl << " Data found in " << count1 + 1 << " position";
            return;
        }
        else
            temp2 = temp2->next;
        count1++;
    }
    cout << endl << " Error : " << data << " not found in list";
}
//Counting the Number of Nodes
void count(){
    trav = h;
    int c = 0;
    while(trav != NULL){
        trav = trav->next;
        c++;
    }
    cout << endl;
    cout << " Counting the Number of Nodes is : ";
    cout << c;
}
// Delete all Node in a non-empty list
void destroy() {
    trav = h;
    while (trav != NULL) {
        des = trav;
        trav = trav->next;
        free(des);
    }
    h = NULL;
    cout << endl << " Destroyed";

}
