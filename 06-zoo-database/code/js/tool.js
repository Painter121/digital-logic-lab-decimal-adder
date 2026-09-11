document.addEventListener("DOMContentLoaded", function () {
    function createTooltip(element, text) {
        let tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        tooltip.innerText = text;
        // ตั้งค่าเริ่มต้น: ซ่อน tooltip ด้วย display: none และ opacity 0
        tooltip.style.opacity = 0;
        tooltip.style.display = "none";
        document.body.appendChild(tooltip);

        function updateTooltipPosition(event) {
            let rect = element.getBoundingClientRect();
            tooltip.style.left = window.scrollX + rect.right + 10 + "px"; // ด้านขวา
            tooltip.style.top = window.scrollY + rect.top + "px";
        }
        
        element.addEventListener("mouseenter", function (event) {
            tooltip.style.display = "block"; // เปิดให้แสดง tooltip
            // บังคับ reflow เพื่อให้ transition ทำงาน (อ่าน offsetHeight)
            tooltip.offsetHeight;
            updateTooltipPosition();
            tooltip.style.opacity = "1";
            window.addEventListener("scroll", updateTooltipPosition);
            window.addEventListener("mousemove", updateTooltipPosition);
        });

        element.addEventListener("mouseleave", function () {
            tooltip.style.opacity = "0";
            // หลังจาก transition เสร็จ ให้ซ่อน tooltip ด้วย display: none
            tooltip.addEventListener("transitionend", function handler() {
                tooltip.style.display = "none";
                tooltip.removeEventListener("transitionend", handler);
            });
            window.removeEventListener("scroll", updateTooltipPosition);
            window.removeEventListener("mousemove", updateTooltipPosition);
        });
    }

    let menuButton = document.querySelector(".admin-menu-open-button");
    if (menuButton) {
        createTooltip(menuButton, "Admin-Menu");
    }

    let tooltips = ["Category", "Animal care", "Animals details", "Employee", "Zone", "Dashboard"];
    document.querySelectorAll(".admin-menu-item").forEach((item, index) => {
        createTooltip(item, tooltips[index] || "Menu Item");
    });
});
