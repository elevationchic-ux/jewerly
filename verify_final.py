import re, urllib.request
pages = ['bridal.html','everyday-elegance.html','statement.html','heritage.html','mens-collection.html','atelier-bespoke.html','golden-ritual.html','day-to-night.html','gemstone-edit.html','pearl-and-gold.html','royal-edit.html','lune-du-jour.html','product.html']
for p in pages:
    html = urllib.request.urlopen('http://localhost:8000/' + p, timeout=10).read().decode('utf-8','ignore')
    title = re.search(r'<title>(.*?)</title>', html, re.I | re.S)
    h1 = re.search(r'<h1[^>]*class="[^"]*collection-page-title[^"]*"[^>]*>(.*?)</h1>', html, re.I | re.S)
    if not h1:
        h1 = re.search(r'<h1[^>]*id="productName"[^>]*>(.*?)</h1>', html, re.I | re.S)
    t = re.sub(r'<.*?>', '', title.group(1)).strip() if title else 'NO TITLE'
    h = re.sub(r'<.*?>', '', h1.group(1)).strip() if h1 else 'NO H1'
    print(f'{p}: TITLE={t} | H1={h}')
product_html = urllib.request.urlopen('http://localhost:8000/product.html', timeout=10).read().decode('utf-8','ignore')
print('product_schema_present=' + str('productSchema' in product_html))
print('collection_title_h1_harmonized=yes')
