import  java.awt.*;
import  java.awt.event.*;
import java.text.DecimalFormat;
import javax.swing.*;
import javax.swing.border.Border;

public class BankGUI {
    private JFrame fr;
    private JPanel pTop,mainPanel,p1,p2;
    private JLabel lTitle,l1,l2,l3;
    private JTextField tf1,tf2,tf3,err;
    private JButton bt1,bt2,bt3;
    private Account ac;

    public BankGUI(Account ac) {
        this.ac = ac;
    }
    public  BankGUI(){

    }
    public void init(){
        DecimalFormat df = new DecimalFormat("#.##");

        fr = new JFrame("Bank");
        fr.setLayout(new BorderLayout());

        pTop = new JPanel();
        pTop.setLayout(new FlowLayout());
        lTitle = new JLabel("Bank");

        pTop.add(lTitle);

        mainPanel = new JPanel();
        mainPanel.setLayout(new BorderLayout());
        p1 = new JPanel();
        p1.setLayout(new GridLayout(3,2));

        l1 = new JLabel("Name");
        l2 = new JLabel("Balance");
        l3 = new JLabel("Amount");

        tf1 = new JTextField();
        tf2 = new JTextField();
        tf3 = new JTextField();
        err = new JTextField();
        tf1.setHorizontalAlignment(SwingConstants.CENTER);
        tf2.setHorizontalAlignment(SwingConstants.CENTER);
        tf3.setHorizontalAlignment(SwingConstants.CENTER);
        err.setHorizontalAlignment(SwingConstants.CENTER);


        tf1.setText(ac.getAccountName());
        tf2.setText(ac.getBalance() + "");

        tf1.setEditable(false);
        tf2.setEditable(false);
        err.setEditable(false);


        p1.add(l1);
        p1.add(tf1);
        p1.add(l2);
        p1.add(tf2);
        p1.add(l3);
        p1.add(tf3);

        p2 = new JPanel();
        p2.setLayout(new FlowLayout());
        bt1 = new JButton("Deposit");
        bt2 = new JButton("Withdraw");
        bt3 = new JButton("Exit");
        p2.add(bt1);
        p2.add(bt2);
        p2.add(bt3);

        mainPanel.add(pTop, BorderLayout.NORTH);

        mainPanel.add(p1,BorderLayout.CENTER);
        mainPanel.add(p2,BorderLayout.SOUTH);
        fr.add(mainPanel,BorderLayout.CENTER);
        fr.add(err,BorderLayout.SOUTH);
        fr.pack();
        fr.setLocationRelativeTo(null);
        fr.setResizable(false);
        fr.setVisible(true);

        bt3.addActionListener(new AbstractAction() {
            public void actionPerformed(ActionEvent e) {
                System.exit(0);
            }
        });
        bt1.addActionListener(new ActionListener() { // deposit
            public void actionPerformed(ActionEvent e) {
                try {
                    String input = tf3.getText();
                    double amount = Double.parseDouble(input);
                    boolean success = ac.deposit(amount);
                    if (success) {
                        tf2.setText(String.valueOf(df.format(ac.getBalance())));
                        err.setText("");
                        tf3.setText("");
                    } else {
                        err.setText("Deposit amount must be greater than 0");
                    }
                } catch (NumberFormatException e2) {
                    err.setText("Please enter a valid amount");
                    tf3.setText("");
                }
            }
        });

        bt2.addActionListener(new ActionListener() { // withdraw
            public void actionPerformed(ActionEvent e) {
                try {
                    String input = tf3.getText();
                    double amount = Double.parseDouble(input);
                    ac.withdraw(amount);
                    tf2.setText(String.valueOf(df.format(ac.getBalance())));
                    err.setText("");
                    tf3.setText("");

                } catch (NumberFormatException e3) {
                    err.setText("Please enter a valid amount");
                    tf3.setText("");

                } catch (IllegalArgumentException e3) {
                    err.setText(e3.getMessage());
                    tf3.setText("");
                }
            }
        });
        fr.addWindowListener(new WindowAdapter() {
            public void windowClosing(WindowEvent e) {
                int confirm = JOptionPane.showConfirmDialog(fr,
                        "Are you sure you want to exit?",
                        "Exit Confirm",
                        JOptionPane.YES_NO_OPTION);
                if(confirm == JOptionPane.YES_OPTION){
                    System.exit(0);
                }else{
                    fr.setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
                }
            }
        });
    }
}
