#include <iostream>
#include <string>
using namespace std;

#define MAX 100 // ตั้งขนาดของการเก็บวงเล็บ

struct Stack{
    int top;   // เก็บตำแหน่งของ top ของ stack
    char data[MAX];  // อาเรย์เพื่อเก็บข้อมูลใน stack
};
Stack x; // สร้างตัวแปรที่มีโครงสร้าง แบบ Stack

//function กำหนดค่า top เริ่มที่ -1
void setTop(Stack &x) {
    x.top = -1; //ตำแหน่งของ top ให้ค่าเป็น -1 เพราะว่า Array เริ่มที่ 0
}

//function สำหรับการเพื่มข้อมูลลง Stack
void push(char in){
    if (x.top < MAX - 1){
        x.top++; //เพิ่มค่า top เพื่อชี้ไปยังตำแหน่งที่อยู่บนสุด
        x.data[x.top] = in; //นำข้อมูลลงไปใส่ใน Stack ยังจุดที่ top ชี้
    }
}

//function สำหรับการเลบข้อมูล Stack
void pop(){
    if (x.top >= 0){
      x.data[x.top] = '\0'; // ลบข้อมมูลในจุดที่ top ชี้
      x.top--; //ลดค่าtop มา 1
    }
}

void display(){ //function สำหรับการแสดงdataแต่ละตัวใน stack
    for(int i = x.top; i >= 0  ; i--){ //Loop การวนรอบเพื่อดูค่าในStack
        cout << x.data[i] << " ";
    }
    if(x.top == -1){// ตรวจสอบว่าจำนวนวงเล็บภายใน Stack ถ้าเท่ากับ -1 แสดงว่าวงเล็บไม่เข้าคู่
        cout << "Closing bracket without matching opening bracket" << endl;
    }
    cout << endl;

}


//function ตรวจสอบวงเล็บปิดตรงกับวงเล็บเปิดตัวไหน
char bracketCheck2(char c){
    switch(c) {
        case '}': return '{';
        case ']': return '[';
        case ')': return '(';
        default: return '\0';
    }
}

//function ตรวจสอบวงเล็บเปิดว่ามีหรือไม่่
bool bracketCheck1(char c){
    if(c == '{'||c == '['||c == '('){
        return true;
    }else{
        return false;
    }
}
//function การแสดงผล description
void printPg(){
    cout << endl;
    cout << "             PARENTHESES CHECKER PROGRAM" << endl;
    cout << endl;
    cout << "-----------------------------------------------------" << endl;
    cout << "Do not input equations with more than 100 characters." << endl;
    cout << "       No spaces are allowed in the equation." << endl;
    cout << "-----------------------------------------------------" << endl;
    cout << endl;
}

int main(){
    printPg(); // แสดงผลคำอธิบายต่างๆ
    do{
        setTop(x);
        string equation;
        bool space = false;
        do{
            //system("cls");
            cout << "Enter equation : ";
            getline(cin,equation); // รับค่าสมการ
            // Loop สำหรับตรวจสอบช่องว่างของค่าที่รับเข้ามา
            for(int i = 0; i <= equation.length() ; i++){
                if(equation[i] == ' '){
                    cout << "Equation should not contain spaces." << endl;
                    cout << endl;
                    space = true;

                }else space = false;
                if(space == true) break;
            }
            //ตรวจสอบว่าค่าที่รับเข้ามาว่างหรือไม่
            if(equation.empty()){
                cout << "Please enter the equation." << endl<< endl;
            //ตรวจสอบว่าข้อมูลที่รับเข้ามามากกว่า 100 ตัวหรือไม่
            }else if(equation.length() > 99){
                cout << "The equation should not exceed 100 characters."<< endl<< endl;
            }
        //ถ้าค่าที่รับเข้ามามากกว่า 100 หรือ มีช่องว่าง หรือ กรอกค่าว่าง ให้วนรับค่าใหม่
        }while(equation.length() > 99 || space == true || equation.empty());
        //cout << equation.length() << endl;

        bool incorrect = false;
        bool hasBracket = false;
        //Loop ในการตรวจสอบว่ามีวงเล็บหรือไม่ และนำวงเล็บเก็บเข้า Stack
        for(int i = 0; i < equation.length() ; i++){
            //ถ้ามีวงเล็บเปิด  ให้ทำการนำค่าหรือนำวงเล็บที่ตรวจสอบได้เข้าไปเก็บใน Stack
            if(bracketCheck1(equation[i])){
                push(equation[i]);
                hasBracket = true;
            //ถ้าไม่ใช่วงเล็บเปิด ตรวจสอบว่าเป็นวงเล็บปิดหรือไม่ถ้าใช่เข้าเงื่อนไข
            }else if(bracketCheck2(equation[i])  != '\0'){
                //ตรวจสอบว่าวงเล็บปิดที่เข้ามา เป็นคู่กับวงเล็บเปิดที่อยู่ตำแหน่ง top หรือไม่และ ข้อมูล ใน Stack ต้องไม่ว่าง
                if(x.data[x.top] == bracketCheck2(equation[i]) &&  x.top != -1){
                    pop(); // นำข้อมูลในตำแหน่งที่  top ชี้ออก
                }else{//กรณีที่วงเล็บไม่เข้าคู่
                    incorrect = true;
                    break;
                }
            }
        }
        //กรณีวงเล็บไม่เข้าคู่ แสดงวงเล็บที่ไม่เข้าคู่และออกจากโปรแกรม
        if(incorrect || x.top != -1){
            cout << "Incorrect : ";
            display();
            return(0);
        }
        // กรณีวงเล็บเข้าคู่ตรวจสอบได้จากการที่ ข้อมูล ใน Stack ต้องว่าง
        else if(hasBracket && x.top == -1){
            cout << "Correct" << endl;
            return(0);
        //กรณีที่ไม่ได้ใส่วงเล็บมาในสมการ ทำการวนรอบเพื่อรับค่าใหม่
        }else if(!hasBracket){
            cout << "No brackets in the equation." << endl;
            cout << endl;
        }
    }while(true);
}
