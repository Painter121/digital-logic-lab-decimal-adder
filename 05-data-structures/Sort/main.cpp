/*
*************************************************************
 Author : Phuriphat Malison
 Code : 66172110157-8
 Author : Nawadon Srikhao
 Code : 66172110221-4
 Author : Chotiphat Suwannawong
 Code : 66172110328-3
 Section : CPE.66241B
 Lab : Sorting
 Course : 04-061-212 Data Structures and Algorithms Laboratory
 Instruction : Supattra Kerdmec
*************************************************************
*/
#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

const int sizeArr = 1000000;
int arr[sizeArr];
int arrCopy[sizeArr];

//swap ค่า
void swap1(int &left , int &right){
    int temp = left;
    left = right;
    right = temp;
}

void selection(int arr[], int n){
    int largest, i, j, last = n - 1;
    for (i = 0; i <= last; i++) {
        largest = i;
        for (j = i + 1; j <= last; j++) {
            if (arr[j] > arr[largest]) {
                largest = j;
            }
        }
        if (i != largest) {
            swap1(arr[i], arr[largest]);
        }
    }
}

void insertion(int arr[], int n){
    int i, j, hold;
    for (i = 1; i < n; i++) {
        hold = arr[i];
        j = i;
        while (j > 0 && arr[j - 1] < hold) {
            arr[j] = arr[j - 1];
            j -= 1;
        }
        arr[j] = hold;
    }
}

void createArray() {
    for (int i = 0; i < sizeArr / 2; i++) {
        arr[i] = sizeArr - i;
    }
    for (int i = sizeArr / 2; i < sizeArr; i++) {
        arr[i] = rand() % sizeArr;
    }
}

void printArr(int arr[], int n) {
    cout << "[";
    for (int k = 0; k < n; k++) {
        cout << arr[k];
        if (k != n - 1) {
            cout << ",";
        }
    }
    cout << "]" << endl;
}

void copyArray() {
    for (int i = 0; i < sizeArr; i++) {
        arrCopy[i] = arr[i];
    }
}

int main() {
    clock_t startTime;
    clock_t endTime;

    createArray();
    copyArray();
    cout << "1 million data elements" << endl;
    cout << "Random numbers may have duplicates. Same data will be used for sorting." << endl;
    cout << "Starting sorting test..." << endl;




    startTime = clock();
    selection(arr, sizeArr);
    endTime = clock();
    double selectionTime = double(endTime - startTime) / CLOCKS_PER_SEC;
    cout << "Selection Sort Time taken: " << selectionTime << " seconds" << endl;


    startTime = clock();
    insertion(arrCopy, sizeArr);
    endTime = clock();
    double insertionTime = double(endTime - startTime) / CLOCKS_PER_SEC;
    cout << "Insertion Sort Time taken: " << insertionTime << " seconds" << endl;

    return 0;
}
