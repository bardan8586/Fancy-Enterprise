// E-Commerce Storage Cleaner - Console Script
// Copy and paste this entire script into your browser console (F12 → Console tab)

console.log("🧹 E-Commerce Storage Cleaner Starting...");
console.log("📊 Current localStorage contents:");

// Display current storage
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    const truncated = value.length > 50 ? value.substring(0, 50) + '...' : value;
    const isProblematic = ['userToken', 'userInfo', 'cart', 'guestId'].includes(key);
    const emoji = isProblematic ? '⚠️' : '📝';
    console.log(`${emoji} ${key}:`, truncated);
}

// Clear problematic keys
const keysToRemove = ['userToken', 'userInfo', 'cart', 'guestId'];
let removedCount = 0;

console.log("\n🔥 Removing problematic keys...");
keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`✅ Removed: ${key}`);
        removedCount++;
    } else {
        console.log(`ℹ️ Not found: ${key}`);
    }
});

console.log(`\n🎉 SUCCESS! Removed ${removedCount} corrupted items.`);
console.log("💡 Next steps:");
console.log("1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)");
console.log("2. Register/Login with fresh credentials");
console.log("3. Test the complete e-commerce flow!");

// Verify cleanup
console.log("\n📋 Remaining localStorage contents:");
if (localStorage.length === 0) {
    console.log("✨ localStorage is completely clean!");
} else {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        const truncated = value.length > 50 ? value.substring(0, 50) + '...' : value;
        console.log(`📝 ${key}:`, truncated);
    }
}

console.log("\n🚀 Ready to test your e-commerce platform!");


