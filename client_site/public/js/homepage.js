// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
}

// Product detail navigation
function showProductDetail(productId) {
    showPage('product-detail');
}

// Size selection functionality
document.addEventListener('DOMContentLoaded', function() {
    // Size button selection
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove selected class from all buttons
            sizeButtons.forEach(b => b.classList.remove('selected'));
            // Add selected class to clicked button
            this.classList.add('selected');
        });
    });

    // Add to cart functionality
    const addToCartBtn = document.querySelector('.add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            alert('Added to cart! (This is a demo - cart functionality would be implemented with a backend)');
        });
    }

    // Thumbnail click functionality (optional enhancement)
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // You can add functionality to change the main image here
            console.log('Thumbnail clicked:', this.textContent);
        });
    });
});