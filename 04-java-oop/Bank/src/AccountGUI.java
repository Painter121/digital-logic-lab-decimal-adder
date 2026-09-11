import java.awt.*;
import java.awt.event.*;
import javax.swing.*;

public class AccountGUI {
    private JFrame fr;
    private JTextField tfName, tfBalance;
    private JButton btCreate;

    public void init() {
        fr = new JFrame("Create Account");
        fr.setLayout(new GridLayout(3, 2));

        JLabel lName = new JLabel("Account Name:");
        JLabel lBalance = new JLabel("Initial Balance:");

        tfName = new JTextField();
        tfBalance = new JTextField();
        btCreate = new JButton("Create");

        fr.add(lName);
        fr.add(tfName);
        fr.add(lBalance);
        fr.add(tfBalance);
        fr.add(new JLabel());
        fr.add(btCreate);

        btCreate.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                createAccount();
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

        fr.setSize(300, 150);
        fr.setLocationRelativeTo(null);
        fr.setResizable(false);
        fr.setVisible(true);
    }

    private void createAccount() {
        String name = tfName.getText();
        String balanceString = tfBalance.getText();
        double balance = 0;

        try {
            balance = Double.parseDouble(balanceString);
            if (balance < 0) {
                JOptionPane.showMessageDialog(fr, "Initial balance cannot be negative.", "Error", JOptionPane.ERROR_MESSAGE);
                return;
            }
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(fr, "Invalid balance input.", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }
        Account ac = new Account(name,balance);
        JOptionPane.showMessageDialog(fr, "Account created successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
        fr.dispose();

        BankGUI bankGUI = new BankGUI(ac);
        bankGUI.init();

    }
}
