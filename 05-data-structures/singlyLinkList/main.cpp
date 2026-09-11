#include <stdlib.h>
#include <stdbool.h>
#include <iostream>

using namespace std;
typedef int dataType;
struct node
{
    dataType data; // int = dataType
    struct node* next;
};

typedef struct node snode ;
snode *head = NULL, *trav = NULL, *newNode, *temp, *pre = NULL;
snode *dltLoc, *current,*des;

// Creating Node
snode* create_node(int dataIn){
    newNode = (snode *)malloc(sizeof(snode));
    if (newNode == NULL){
        cout << endl << "Memory was not allocated";
        return 0;
    }else{
        newNode->data = dataIn;
        newNode->next = NULL;
        return newNode;
    }
}

// Inserting Node at First
void insert_node_first(int value){
//create a newnode
    newNode = create_node(value);
    if(head == pre && head == NULL){
        newNode->next = head;
        head = pre = newNode;
    }else{
        temp = head;
        head = newNode;
        newNode->next = temp;
    }
}

// Inserting Node at Last
void insert_node_last(int value){
//create a newnode
    newNode = create_node(value);
    if(head == pre && head == NULL){
        newNode->next = head;
        head = pre = newNode;
    }
    else{
        pre->next = newNode;
        pre = newNode;
    }

}
// Insert Node from specified position in a non-empty list
void insert_node_pos(int value, int pos){
    dataType cnt = 0, i; //create a newnode
    newNode = create_node(value);
    trav = head;
    while(trav != NULL){
        trav = trav->next;
        cnt++;
    }
    if(pos ==1){
        if(head == pre && head == NULL){
            newNode->next = head;
            head = pre = newNode;
        }
        else{
            temp = head;
            head = newNode;
            newNode->next = temp;
        }
    }else if(pos > 1 && pos<= cnt){
        trav = head;
        for(i = 1; i < pos; i++){
            pre = trav;
            trav = trav->next;
        }
        pre->next = newNode;
        newNode->next = trav;
    }
    else
        cout <<"Position is out of range";
}
//Empty list
bool isEmpty(snode*ptr)
{
    return ptr ? false : true;
}

// Displays non-empty List from Beginning to End
void printList(){
    trav = head;
    if(isEmpty(trav)){
            cout << "Empty List";
    //Empty List
    }
    else{
        cout << endl << "[ ";
        while(trav != NULL){
            cout << trav->data << " -->";
            trav = trav->next;
        }
        cout <<"NULL";
        cout << " ]" << endl;
    }

}
// Counting the Number of Nodes
void count(){
    int c = 0;
    trav = head;
    while(trav != NULL){
        c++;
        trav = trav->next;
    }
    cout << "Counting the Number of Nodes is : " << c << endl;
}
// Deleting Node at First
void del_node_first(){
    if(isEmpty(head)){
            cout << "Empty List";
    //Empty List
    }
    else{
        trav = head;
        head = head->next;
        free(trav);
    }
}


// Deleting Node at last
void del_node_last(){
    if(isEmpty(head))
    {
        cout << "Empty List";
    //Empty List
    }
    else{
        trav = head;
        while(trav->next != NULL){
            pre = trav;
            trav = trav->next;
        }

        free(trav);

        pre->next = NULL;

    }

}

// Delete Node from specified position in a non-empty list

void delete_pos(int pos){
    dataType cnt = 0, i;
    if (isEmpty(head)){
        cout << "Empty List";
//Empty List
    }
    else{
        trav = head;
        if (pos == 1){
            head = trav->next;
            cout << endl << "Element deleted";
        }
        else{
            while (trav != NULL){
                trav = trav->next;
                cnt = cnt + 1;
            }
            if (pos > 0 && pos <= cnt){
                trav = head;
                for (i = 1; i < pos; i++){
                    pre = trav;
                    trav = trav->next;
                }pre->next = trav->next;
            }
            else
                cout << "Position is out of range";
            free(trav);
        }
    }
}

//searching an element in a non-empty list

void search(int target)
{
    dataType flag = 0, pos = 0;
    if (isEmpty(head)){
        cout << "Empty List";
    //Empty List
    }else{
        for (trav = head; trav != NULL; trav = trav->next){
            pos = pos + 1;
            if (trav->data == target){
                flag = 1;
                break;
            }
        }
        if (flag == 1)
            cout << "Element " << target << " found at " << pos << " position" << endl;
        else
            cout << "Element " << target << " not found in list" << endl;
    }
}

// Delete all Node in a non-empty list

void destroy(){
    current = head;
    while (current != NULL){
        if (current == NULL) break;
        else{
            des = current->next;
            free(current);
            current = des;
        }
    }
    head = NULL;
}

int main(){
    dataType data; // int data
    cout << endl << "...Inserting..." << endl;
    for (data = 5; data > 0; data--)
        insert_node_first(data);
    insert_node_last(8);
    insert_node_last(9);
    insert_node_pos(7, 6);
    printList();
    cout << endl << "...Deleting node at last..." << endl;
    del_node_last();
    printList();
    cout << endl << "...Deleting node from any Position..." << endl;
    delete_pos(3);
    printList();
    cout << endl << "...Searching Element in the List..." << endl;
    search(9);
    search(3);
    cout << endl;
    cout << "------------------------------------------------------"<<endl;

    printList();
    count();
    cout << endl;
    cout << ">> Delete Node First << ";
    del_node_first();
    printList();
    count();
    cout << endl;
    cout << ">> Destroy << ";
    destroy();
    cout << endl;
    count();
    printList();
    return 0;
}
