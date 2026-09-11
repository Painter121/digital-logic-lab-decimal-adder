public class Stock {
    private String[] stockItems;
    private int[] stockQuantities;

    public Stock() {
        stockItems = new String[]{"Red Paint", "Blue Paint", "Green Paint", "Yellow Paint"};
        stockQuantities = new int[]{10, 8, 5, 12}; // กำหนดจำนวนคงคลังเริ่มต้น
    }

    public String[] getStockItems() {
        return stockItems;
    }

    public int getStockQuantity(String itemName) {
        for (int i = 0; i < stockItems.length; i++) {
            if (stockItems[i].equals(itemName)) {
                return stockQuantities[i];
            }
        }
        return 0; // หากไม่มีรายการนี้ใน stock
    }

    public boolean reduceStock(String itemName, int amount) {
        for (int i = 0; i < stockItems.length; i++) {
            if (stockItems[i].equals(itemName)) {
                if (stockQuantities[i] >= amount) {
                    stockQuantities[i] -= amount; // ลดจำนวนสินค้าคงคลัง
                    return true; // การลดสำเร็จ
                } else {
                    return false; // จำนวนสินค้าที่ต้องการมากเกินไป
                }
            }
        }
        return false; // ไม่พบสินค้านี้
    }
}
