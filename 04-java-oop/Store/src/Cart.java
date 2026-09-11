import javax.swing.*;
import java.util.ArrayList;

public class Cart {
    private ArrayList<String> items;
    private ArrayList<Integer> amounts;
    private ArrayList<Double> totalPrices;

    private double grandTotal = 0; // ผลรวมราคาทั้งหมด

    public Cart() {
        items = new ArrayList<>();
        amounts = new ArrayList<>();
        totalPrices = new ArrayList<>();
    }

    public void addItem(String item, int amount, double price) {
        items.add(item);
        amounts.add(amount);
        double totalPrice = price * amount;
        totalPrices.add(totalPrice);
        grandTotal += totalPrice; // คำนวณผลรวมทั้งหมด
    }

    public void displayCart() {
        StringBuilder cartDetails = new StringBuilder();
        for (int i = 0; i < items.size(); i++) {
            cartDetails.append(items.get(i))
                    .append(" - ")
                    .append(amounts.get(i))
                    .append(" units - Total: ")
                    .append(totalPrices.get(i))
                    .append(" THB\n");
        }

        cartDetails.append("\nGrand Total: ").append(grandTotal).append(" THB");

        if (cartDetails.length() == 0) {
            cartDetails.append("Your cart is empty.");
        }

        JOptionPane.showMessageDialog(null, cartDetails.toString(), "Cart Details", JOptionPane.INFORMATION_MESSAGE);
    }
}
