# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# google app script code in google sheets

```js
// กด Deploy เป็น Web App โดยอนุญาต Anyone สามารถเข้าถึงได้

function doPost(e) {
  const sheet = SpreadsheetApp.openByUrl(
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" // google sheets url 
  ).getSheetByName("Sheet1");

  // หาคิวล่าสุด
  const lastRow = sheet.getLastRow();
  let lastQueue = 0;
  if (lastRow >= 2) {
    const value = sheet.getRange(lastRow, 1).getValue();
    lastQueue = typeof value === "number" ? value : parseInt(value) || 0;
  }
  const queueNumber = lastQueue + 1;

  // รวมรายการอาหาร + นับจำนวน
  const itemMap = new Map();
  let total = 0;

  for (let i = 1; i <= 100; i++) {
    const food = e.parameter[`food${i}`];
    if (!food) break;

    if (itemMap.has(food)) {
      itemMap.set(food, itemMap.get(food) + 1);
    } else {
      itemMap.set(food, 1);
    }

    // ดึงราคา (ข้าวผัด (50฿))
    const match = food.match(/\((\d+)[฿]?\)/);
    if (match && match[1]) {
      total += parseInt(match[1]);
    }
  }

  const row = [queueNumber];
  for (const [food, count] of itemMap.entries()) {
    if (count > 1) {
      row.push(`${food} ×${count}`);
    } else {
      row.push(food);
    }
  }

  row.push("รวม: " + total + " บาท");
  row.push("pending");

  sheet.appendRow(row);

  return ContentService.createTextOutput("Queue:" + queueNumber);
}

function doGet() {
  const sheet = SpreadsheetApp.openByUrl(
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" // google sheets url
  ).getSheetByName("Sheet1");

  const data = sheet.getDataRange().getValues();
  const orders = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const queue = row[0];
    const items = row.slice(1, row.length - 2);
    const totalText = row[row.length - 2];
    const status = row[row.length - 1] || "pending";

    orders.push({
      rowIndex: i + 1, // แถวใน sheet
      queue,
      items,
      totalText,
      status,
    });
  }

  return ContentService.createTextOutput(JSON.stringify(orders)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doDelete(e) {
  const rowIndex = parseInt(e.parameter.rowIndex);
  if (!rowIndex || rowIndex < 2) {
    return ContentService.createTextOutput("Invalid row");
  }
  const sheet = SpreadsheetApp.openByUrl(
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" // google sheets url
  ).getSheetByName("Sheet1");
  sheet.deleteRow(rowIndex);
  return ContentService.createTextOutput("Deleted");
}

// อัปเดตสถานะ (เช่น เปลี่ยนเป็น 'paid')
function doPut(e) {
  const rowIndex = parseInt(e.parameter.rowIndex);
  const newStatus = e.parameter.status;
  if (!rowIndex || rowIndex < 2 || !newStatus) {
    return ContentService.createTextOutput("Invalid parameters");
  }
  const sheet = SpreadsheetApp.openByUrl(
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" // google sheets url
  ).getSheetByName("Sheet1");

  sheet.getRange(rowIndex, sheet.getLastColumn()).setValue(newStatus);
  return ContentService.createTextOutput("Updated");
}
```


By.khinghello aurphix TEAM
