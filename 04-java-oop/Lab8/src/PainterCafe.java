import java.awt.*;
import javax.swing.*;
import javax.swing.border.Border;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import java.awt.event.*;;
    public class PainterCafe {
        private int matcha; //80 บาท
        private int americano; //65
        private int greentea; //75
        private int espresso; //70
        private int freashMilk; //60


        public int getMatcha() {
            return matcha;
        }

        public void setMatcha(int matcha) {
            this.matcha = matcha;
        }

        public int getAmericano() {
            return americano;
        }

        public void setAmericano(int americano) {
            this.americano = americano;
        }

        public int getGreentea() {
            return greentea;
        }

        public void setGreentea(int greentea) {
            this.greentea = greentea;
        }

        public int getEspresso() {
            return espresso;
        }

        public void setEspresso(int espresso) {
            this.espresso = espresso;
        }

        public int getFreashMilk() {
            return freashMilk;
        }

        public void setFreashMilk(int freashMilk) {
            this.freashMilk = freashMilk;
        }

        public int calculator(){
            int ans = (matcha*80)+(americano*65)+(greentea*75)+(espresso*70)+(freashMilk*60);
            return ans;
        }

        public static void main(String[] args) {
            PainterCafe pc = new PainterCafe();

            Frame fr = new Frame("Painter Cafe");
            fr.setLayout(null);
            fr.setSize(250,300);

            Choice ch1 = new Choice();
            ch1.addItem("Drink in Cafe");
            ch1.addItem("Take Home");
            ch1.addItem("Delivery");
            ch1.setBounds(25,40,200,40);

            Label l1 = new Label("Menu");
            Label l2 = new Label("Amount");
            l1.setBounds(65,65,100,25);
            l2.setBounds(185,65,100,25);
            fr.add(l1);
            fr.add(l2);

            Checkbox cb1 = new Checkbox("Matcha (80 Baht)");
            Checkbox cb2 = new Checkbox("Americano (65 Bath)");
            Checkbox cb3 = new Checkbox("Greentea (75 baht)");
            Checkbox cb4 = new Checkbox("Espresso(70 baht)");
            Checkbox cb5 = new Checkbox("Freash Milk(60 baht)");
            fr.add(cb1);
            fr.add(cb2);
            fr.add(cb3);
            fr.add(cb4);
            fr.add(cb5);
            cb1.setBounds(25,95,120,25);
            cb2.setBounds(25,120,120,25);
            cb3.setBounds(25,145,120,25);
            cb4.setBounds(25,170,120,25);
            cb5.setBounds(25,195,120,25);

            JTextField tf1 = new JTextField();
            JTextField tf2 = new JTextField();
            JTextField tf3 = new JTextField();
            JTextField tf4 = new JTextField();
            JTextField tf5 = new JTextField();
            fr.add(tf1);
            fr.add(tf2);
            fr.add(tf3);
            fr.add(tf4);
            fr.add(tf5);
            tf1.setEditable(false);
            tf2.setEditable(false);
            tf3.setEditable(false);
            tf4.setEditable(false);
            tf5.setEditable(false);
            tf1.setHorizontalAlignment(JTextField.CENTER);
            tf2.setHorizontalAlignment(JTextField.CENTER);
            tf3.setHorizontalAlignment(JTextField.CENTER);
            tf4.setHorizontalAlignment(JTextField.CENTER);
            tf5.setHorizontalAlignment(JTextField.CENTER);
            tf1.setBounds(190,95,32,20);
            tf2.setBounds(190,120,32,20);
            tf3.setBounds(190,145,32,20);
            tf4.setBounds(190,170,32,20);
            tf5.setBounds(190,195,32,20);

            cb1.addItemListener(new ItemListener() {             // Matcha
                public void itemStateChanged(ItemEvent e){
                    if(e.getStateChange() == ItemEvent.SELECTED){
                        pc.setMatcha(1);
                        tf1.setText("1");
                        tf1.setEditable(false);
                        System.out.println("Amount of Matcha = " + pc.getMatcha());
                    }else{
                        pc.setMatcha(0);
                        tf1.setText("");
                        tf1.setEditable(false);
                        System.out.println("Amount of Matcha = " + pc.getMatcha());
                    }
                }
            });
            cb2.addItemListener(new ItemListener(){              // Americano
                public void itemStateChanged(ItemEvent e){
                    if(e.getStateChange() == ItemEvent.SELECTED){
                        pc.setAmericano(1);
                        tf2.setText("1");
                        tf2.setEditable(false);
                        System.out.println("Amount of Americano = " + pc.getAmericano());
                    }else{
                        pc.setAmericano(0);
                        tf2.setText("");
                        tf2.setEditable(false);
                        System.out.println("Amount of Americano = " + pc.getAmericano());
                    }
                }
            });
            cb3.addItemListener(new ItemListener(){              //Greentea
                public void itemStateChanged(ItemEvent e){
                    if(e.getStateChange() == ItemEvent.SELECTED){
                        pc.setGreentea(1);
                        tf3.setText("1");
                        tf3.setEditable(false);
                        System.out.println("Amount of Greentea = " + pc.getGreentea());
                    }else {
                        pc.setGreentea(0);
                        tf3.setText("");
                        tf3.setEditable(false);
                        System.out.println("Amount of Greentea = " + pc.getGreentea());
                    }
                }
            });
            cb4.addItemListener(new ItemListener(){               //Espresso
                public void itemStateChanged(ItemEvent e){
                    if(e.getStateChange() == ItemEvent.SELECTED){
                        pc.setEspresso(1);
                        tf4.setText("1");
                        tf4.setEditable(false);
                        System.out.println("Amount of Espresso = " + pc.getEspresso());
                    }else {
                        pc.setEspresso(0);
                        tf4.setText("");
                        tf4.setEditable(false);
                        System.out.println("Amount of Espresso = " + pc.getEspresso());
                    }
                }
            });
            cb5.addItemListener(new ItemListener(){              //freashMilk
                public void itemStateChanged(ItemEvent e){
                    if(e.getStateChange() == ItemEvent.SELECTED){
                        pc.setFreashMilk(1);
                        tf5.setText("1");
                        tf5.setEditable(false);
                        System.out.println("Amount of FreashMilk = " + pc.getFreashMilk());
                    }else {
                        pc.setFreashMilk(0);
                        tf5.setText("");
                        tf5.setEditable(false);
                        System.out.println("Amount of FreashMilk = " + pc.getFreashMilk());
                    }
                }
            });

            //cb1.addItemListener(e -> tf1.setEditable(e.getStateChange() == ItemEvent.SELECTED));



            Button bt1 = new Button("Order");
            Button bt2 = new Button("Exit");
            bt1.setBounds(55,240,60,25);
            bt2.setBounds(135,240,60,25);
            Dialog d = new Dialog(fr,"Order",true);
            d.setSize(200,270);
            Button ok = new Button(" Ok ");
            Label l12 = new Label();

            bt1.addActionListener(new ActionListener(){
                public void actionPerformed(ActionEvent e){

                    d.setLayout(new BorderLayout());
                    Panel p3 = new Panel(); // Ch1
                    Panel p4 = new Panel();
                    Panel p5 = new Panel();
                    Panel p6 = new Panel();


                    Label l6 = new Label(); // cb

                    Label l7 = new Label();
                    Label l8 = new Label();
                    Label l9 = new Label();
                    Label l10 = new Label();
                    Label l11 = new Label();

                    p5.setLayout(new GridLayout(7,1));
                    p4.setLayout(new FlowLayout());
                    p4.add(p5);
                    p3.setLayout(new FlowLayout());
                    p3.add(l6);
                    p6.setLayout(new FlowLayout());
                    p6.add(ok);

                    d.add(p4,BorderLayout.CENTER);
                    d.add(p3,BorderLayout.NORTH);
                    d.add(p6,BorderLayout.SOUTH);
                    l6.setText(ch1.getSelectedItem());

                    if(cb1.getState()){
                        p5.add(l7);
                        l7.setText("Matcha : " + pc.getMatcha());
                    }if(cb2.getState()){
                        p5.add(l8);
                        l8.setText("Americano : " + pc.getAmericano());
                    }if(cb3.getState()){
                        p5.add(l9);
                        l9.setText("Greentea : " + pc.getGreentea());
                    }if(cb4.getState()){
                        p5.add(l10);
                        l10.setText("Espresso : " + pc.getEspresso());
                    }if(cb5.getState()){
                        p5.add(l11);
                        l11.setText("Fresh Milk : " + pc.getFreashMilk());
                    }if(cb1.getState() || cb2.getState() || cb3.getState() || cb4.getState() || cb5.getState()){
                        Label l13 = new Label("-----------------------------");
                        l12.setText("Total : " + pc.calculator() + " Baht");
                        p5.add(l13);
                        p5.add(l12);

                        d.setVisible(true);
                    }

                }
            });
            d.addWindowListener(new WindowAdapter(){
                public void windowClosing(WindowEvent e){
                    d.setVisible(false);
                    d.removeAll();
                }
            });


            ok.addActionListener(new ActionListener() {
                public void actionPerformed(ActionEvent e) {
                    d.setVisible(false);
                    d.removeAll();
                }
            });

            bt2.addActionListener(new ActionListener(){ //ปุ่มออกจากโปรแกรม
                public void actionPerformed(ActionEvent e){
                    System.exit(0);
                }
            });

            Dialog d2 = new Dialog(fr,"Confirm Exit",true);
            d2.setSize(210,100);
            d2.setLayout(new BorderLayout());
            Label l5 = new Label("Are you sure you want to exit?");
            Panel p1 = new Panel();
            p1.setLayout(new FlowLayout());
            p1.add(l5);

            Button b3 = new Button("Exit");
            Button b4 = new Button("Cancel");
            Panel p2 = new Panel();
            p2.setLayout(new FlowLayout());
            p2.add(b3);
            p2.add(b4);
            d2.add(p2,BorderLayout.CENTER);
            d2.add(p1,BorderLayout.NORTH);

            b3.addActionListener(new ActionListener(){
                public void actionPerformed(ActionEvent e){
                    System.exit(0);
                }
            });
            b4.addActionListener(new ActionListener(){
                public void actionPerformed(ActionEvent e){
                    d2.setVisible(false);
                }
            });
            d2.addWindowListener(new WindowAdapter(){
                public void windowClosing(WindowEvent e){
                    d2.setVisible(false);
                }
            });

            Button bm1 = new Button("-");
            bm1.setBounds(170,97,15,15);
            fr.add(bm1);
            Button bm2 = new Button("-");
            bm2.setBounds(170,122,15,15);
            fr.add(bm2);
            Button bm3 = new Button("-");
            bm3.setBounds(170,147,15,15);
            fr.add(bm3);
            Button bm4 = new Button("-");
            bm4.setBounds(170,172,15,15);
            fr.add(bm4);
            Button bm5 = new Button("-");
            bm5.setBounds(170,197,15,15);
            fr.add(bm5);

            Button bp1 = new Button("+");
            bp1.setBounds(225,97,15,15);
            fr.add(bp1);
            Button bp2 = new Button("+");
            bp2.setBounds(225,122,15,15);
            fr.add(bp2);
            Button bp3 = new Button("+");
            bp3.setBounds(225,147,15,15);
            fr.add(bp3);
            Button bp4 = new Button("+");
            bp4.setBounds(225,172,15,15);
            fr.add(bp4);
            Button bp5 = new Button("+");
            bp5.setBounds(225,197,15,15);
            fr.add(bp5);

            bp1.addActionListener(new ActionListener() {               //Matcha
                public void actionPerformed(ActionEvent e) {
                    if(tf1.getText().isEmpty()){
                        cb1.setState(true);
                        tf1.setText("1");
                        pc.setMatcha(1);
                        System.out.println("Amount of Matcha = " + pc.getMatcha());
                    }else{
                        pc.setMatcha(pc.getMatcha() + 1);
                        tf1.setText(pc.getMatcha() + "");
                        System.out.println("Amount of Matcha = " + pc.getMatcha());
                    }
                }
            });
            bp2.addActionListener(new ActionListener() {               // Americano
                public void actionPerformed(ActionEvent e) {
                    if(tf2.getText().isEmpty()){
                        cb2.setState(true);
                        tf2.setText("1");
                        pc.setAmericano(1);
                        System.out.println("Amount of Americano = " + pc.getAmericano());
                    }else{
                        pc.setAmericano(pc.getAmericano() + 1);
                        tf2.setText(pc.getAmericano() + "");
                        System.out.println("Amount of Americano = " + pc.getAmericano());
                    }
                }
            });
            bp3.addActionListener(new ActionListener() {               //greentea
                public void actionPerformed(ActionEvent e) {
                    if(tf3.getText().isEmpty()){
                        cb3.setState(true);
                        tf3.setText("1");
                        pc.setGreentea(1);
                        System.out.println("Amount of Greentea = " + pc.getGreentea());
                    }else{
                        pc.setGreentea(pc.getGreentea() + 1);
                        tf3.setText(pc.getGreentea() + "");
                        System.out.println("Amount of Greentea = " + pc.getGreentea());
                    }
                }
            });
            bp4.addActionListener(new ActionListener() {               //espresso
                public void actionPerformed(ActionEvent e) {
                    if(tf4.getText().isEmpty()){
                        cb4.setState(true);
                        tf4.setText("1");
                        pc.setEspresso(1);
                        System.out.println("Amount of Espresso = " + pc.getEspresso());
                    }else{
                        pc.setEspresso(pc.getEspresso() + 1);
                        tf4.setText(pc.getEspresso() + "");
                        System.out.println("Amount of Espresso = " + pc.getEspresso());
                    }
                }
            });
            bp5.addActionListener(new ActionListener() {               //freashMilk
                public void actionPerformed(ActionEvent e) {
                    if(tf5.getText().isEmpty()){
                        cb5.setState(true);
                        tf5.setText("1");
                        pc.setFreashMilk(1);
                        System.out.println("Amount of FreashMilk = " + pc.getFreashMilk());
                    }else{
                        pc.setFreashMilk(pc.getFreashMilk() + 1);
                        tf5.setText(pc.getFreashMilk() + "");
                        System.out.println("Amount of FreashMilk = " + pc.getFreashMilk());
                    }
                }
            });






            bm1.addActionListener(new ActionListener() {       //Matcha
                public void actionPerformed(ActionEvent e){
                    if(tf1.getText().isEmpty()){
                        System.out.println("Amount of Matcha = " + pc.getMatcha());
                    }else{
                        if(pc.getMatcha() > 1){
                            pc.setMatcha(pc.getMatcha() - 1);
                            tf1.setText(pc.getMatcha() + "");
                            System.out.println("Amount of Matcha = " + pc.getMatcha());
                        }else{
                            cb1.setState(false);
                            pc.setMatcha(0);
                            tf1.setText("");
                            System.out.println("Amount of Matcha = " + pc.getMatcha());
                        }
                    }
                }
            });
            bm2.addActionListener(new ActionListener() {              // Americano
                public void actionPerformed(ActionEvent e){
                    if(tf2.getText().isEmpty()){
                        System.out.println("Amount of Americano = " + pc.getAmericano());
                    }else{
                        if(pc.getAmericano() > 1){
                            pc.setAmericano(pc.getAmericano() - 1);
                            tf2.setText(pc.getAmericano() + "");
                            System.out.println("Amount of Americano = " + pc.getAmericano());
                        }else{
                            cb2.setState(false);
                            pc.setAmericano(0);
                            tf2.setText("");
                            System.out.println("Amount of Americano = " + pc.getAmericano());
                        }
                    }
                }
            });
            bm3.addActionListener(new ActionListener() {              // Greentea
                public void actionPerformed(ActionEvent e){
                    if(tf3.getText().isEmpty()){
                        System.out.println("Amount of Greentea = " + pc.getGreentea());
                    }else{
                        if(pc.getGreentea() > 1){
                            pc.setGreentea(pc.getGreentea() - 1);
                            tf3.setText(pc.getGreentea() + "");
                            System.out.println("Amount of Greentea = " + pc.getGreentea());
                        }else{
                            cb3.setState(false);
                            pc.setGreentea(0);
                            tf3.setText("");
                            System.out.println("Amount of Greentea = " + pc.getGreentea());
                        }
                    }
                }
            });
            bm4.addActionListener(new ActionListener() {              // Espresso
                public void actionPerformed(ActionEvent e){
                    if(tf4.getText().isEmpty()){
                        System.out.println("Amount of Espresso = " + pc.getEspresso());
                    }else{
                        if(pc.getEspresso() > 1){
                            pc.setEspresso(pc.getEspresso() - 1);
                            tf4.setText(pc.getEspresso() + "");
                            System.out.println("Amount of Espresso = " + pc.getEspresso());
                        }else{
                            cb4.setState(false);
                            pc.setEspresso(0);
                            tf4.setText("");
                            System.out.println("Amount of Espresso = " + pc.getEspresso());
                        }
                    }
                }
            });
            bm5.addActionListener(new ActionListener() {              //   FreashMilk
                public void actionPerformed(ActionEvent e){
                    if(tf5.getText().isEmpty()){
                        System.out.println("Amount of FreashMilk = " + pc.getFreashMilk());
                    }else{
                        if(pc.getFreashMilk() > 1){
                            pc.setFreashMilk(pc.getFreashMilk() - 1);
                            tf5.setText(pc.getFreashMilk() + "");
                            System.out.println("Amount of FreashMilk = " + pc.getFreashMilk());
                        }else{
                            cb5.setState(false);
                            pc.setFreashMilk(0);
                            tf5.setText("");
                            System.out.println("Amount of FreashMilk = " + pc.getFreashMilk());
                        }
                    }
                }
            });

            fr.add(bt1);
            fr.add(bt2);
            fr.add(ch1);
            fr.setResizable(false);
            d.setLocationRelativeTo(null);
            d2.setLocationRelativeTo(null);
            d2.setResizable(false);
            d.setResizable(false);
            fr.setLocationRelativeTo(null);
            fr.addWindowListener(new WindowAdapter() {
                public void windowClosing(WindowEvent e) {
                    d2.setVisible(true);
                }
            });
            fr.setVisible(true);
        }
    }
