import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;

public class StoreGUI {
    private JFrame fr;
    private JPanel mainPanel, northPanel, centerPanel, southPanel;
    private JLabel titleLabel, l1, l2, l3, l4, priceLabel, stockLabel;
    private JComboBox<String> comboBox;
    private JTextField tf1;
    private JButton bt1, bt2, bt3;
    private Stock stock;
    private Cart cart;

    public void init() {
        fr = new JFrame("Paint Store");
        fr.setLayout(new FlowLayout());

        mainPanel = new JPanel();
        mainPanel.setLayout(new BorderLayout());

        northPanel = new JPanel();
        northPanel.setLayout(new FlowLayout());

        titleLabel = new JLabel("Paint Store");
        northPanel.add(titleLabel);

        // สร้างและตั้งค่าคลาส Stock
        stock = new Stock();
        String[] items = stock.getStockItems();

        DefaultListCellRenderer ls = new DefaultListCellRenderer();
        ls.setHorizontalAlignment(SwingConstants.CENTER);
        comboBox = new JComboBox<>(items);
        comboBox.setRenderer(ls);

        // เพิ่ม ActionListener ให้กับ ComboBox
        comboBox.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String selectedItem = (String) comboBox.getSelectedItem();
                // กำหนดราคาและสต็อกตามสินค้า
                priceLabel.setText(getPrice(selectedItem) + " THB");
                stockLabel.setText(stock.getStockQuantity(selectedItem) + " units");
            }
        });

        centerPanel = new JPanel();
        centerPanel.setLayout(new GridLayout(4, 2));
        centerPanel.add(l1 = new JLabel("Name"));
        centerPanel.add(comboBox);
        centerPanel.add(l2 = new JLabel("Price"));
        centerPanel.add(priceLabel = new JLabel());
        centerPanel.add(l3 = new JLabel("Stock"));
        centerPanel.add(stockLabel = new JLabel());
        centerPanel.add(l4 = new JLabel("Amount"));
        centerPanel.add(tf1 = new JTextField());

        l1.setHorizontalAlignment(SwingConstants.CENTER);
        l2.setHorizontalAlignment(SwingConstants.CENTER);
        l3.setHorizontalAlignment(SwingConstants.CENTER);
        l4.setHorizontalAlignment(SwingConstants.CENTER);

        tf1.setHorizontalAlignment(SwingConstants.CENTER);

        cart = new Cart();

        bt1 = new JButton("Add to Cart");
        bt2 = new JButton("View Cart");
        bt3 = new JButton("Exit");

        southPanel = new JPanel();
        southPanel.setLayout(new FlowLayout());
        southPanel.add(bt1);
        southPanel.add(bt2);
        southPanel.add(bt3);

        mainPanel.add(southPanel, BorderLayout.SOUTH);
        mainPanel.add(centerPanel, BorderLayout.CENTER);
        mainPanel.add(northPanel, BorderLayout.NORTH);

        fr.add(mainPanel);
        fr.setLocationRelativeTo(null);
        fr.setResizable(false);
        fr.pack();
        fr.setVisible(true);

        fr.addWindowListener(new WindowAdapter() {
            public void windowClosing(WindowEvent e) {
                int confirm = JOptionPane.showConfirmDialog(fr,
                        "Are you sure you want to exit?",
                        "Exit Confirm",
                        JOptionPane.YES_NO_OPTION
                );
                if (confirm == JOptionPane.YES_OPTION) {
                    System.exit(0);
                } else {
                    fr.setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
                }
            }
        });

        // ActionListener สำหรับปุ่ม "Add to Cart"
        bt1.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String selectedItem = (String) comboBox.getSelectedItem();
                int amount;
                try {
                    amount = Integer.parseInt(tf1.getText());
                    if (amount <= 0) {
                        JOptionPane.showMessageDialog(fr, "Please enter a valid amount.");
                    } else if (stock.reduceStock(selectedItem, amount)) {
                        double price = getPrice(selectedItem);
                        cart.addItem(selectedItem, amount, price);
                        JOptionPane.showMessageDialog(fr, "Item added to cart!");
                        stockLabel.setText(stock.getStockQuantity(selectedItem) + " units");
                    } else {
                        JOptionPane.showMessageDialog(fr, "Insufficient stock.");
                    }
                } catch (NumberFormatException ex) {
                    JOptionPane.showMessageDialog(fr, "Please enter a valid number for the amount.");
                }
            }
        });

        // ActionListener สำหรับปุ่ม "View Cart"
        bt2.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                cart.displayCart();
            }
        });

        // ActionListener สำหรับปุ่ม "Exit"
        bt3.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                System.exit(0);
            }
        });
    }

    // ฟังก์ชันสำหรับดึงราคาสินค้า
    private double getPrice(String itemName) {
        switch (itemName) {
            case "Red Paint":
                return 200;
            case "Blue Paint":
                return 180;
            case "Green Paint":
                return 220;
            case "Yellow Paint":
                return 190;
            default:
                return 0;
        }
    }
}
