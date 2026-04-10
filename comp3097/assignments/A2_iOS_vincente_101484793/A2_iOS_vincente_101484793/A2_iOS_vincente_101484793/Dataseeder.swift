//
//  Dataseeder.swift
//  A2_iOS_vincente_101484793
//
//  Created by vs on 2026-04-09.
//


import CoreData
 
struct DataSeeder {
 
    static func seedIfNeeded() {
        let ctx = CoreDataStack.shared.context
        let request: NSFetchRequest<Product> = Product.fetchRequest()
        let count = (try? ctx.count(for: request)) ?? 0
        guard count == 0 else { return }   // Already seeded
 
        let sampleProducts: [(id: Int64, name: String, desc: String, price: Double, provider: String)] = [
            (1,  "MacBook Pro 16\"",
             "Apple's most powerful laptop with M3 Pro chip, 18GB RAM, and 512GB SSD.",
             2499.99, "Apple Inc."),
 
            (2,  "Sony WH-1000XM5",
             "Industry-leading noise-cancelling wireless headphones with 30-hour battery life.",
             349.99, "Sony Corporation"),
 
            (3,  "Samsung 65\" QLED TV",
             "4K QLED display with Quantum HDR, 120Hz refresh rate and built-in Alexa.",
             1199.99, "Samsung Electronics"),
 
            (4,  "Dyson V15 Detect",
             "Cordless vacuum with laser dust detection and HEPA filtration up to 0.3 microns.",
             749.99, "Dyson Ltd."),
 
            (5,  "iPad Pro 12.9\"",
             "Ultra-thin iPad with M2 chip, Liquid Retina XDR display and Apple Pencil support.",
             1099.99, "Apple Inc."),
 
            (6,  "Logitech MX Master 3S",
             "Ergonomic wireless mouse with 8K DPI sensor, quiet clicks and USB-C charging.",
             99.99, "Logitech International"),
 
            (7,  "Nespresso Vertuo Next",
             "Single-serve coffee machine with Centrifusion technology and 5 cup sizes.",
             179.99, "Nestlé Nespresso SA"),
 
            (8,  "Nintendo Switch OLED",
             "Gaming console with 7-inch OLED screen, enhanced audio and 64GB storage.",
             349.99, "Nintendo Co., Ltd."),
 
            (9,  "Fitbit Charge 6",
             "Advanced fitness tracker with built-in GPS, heart rate monitoring and 7-day battery.",
             159.99, "Google LLC"),
 
            (10, "Anker 737 Power Bank",
             "140W portable charger with 24,000mAh capacity and intelligent power management.",
             129.99, "Anker Innovations")
        ]
 
        for p in sampleProducts {
            let product = Product(context: ctx)
            product.productID          = p.id
            product.name               = p.name
            product.productDescription = p.desc
            product.price              = p.price
            product.provider           = p.provider
        }
 
        CoreDataStack.shared.saveContext()
        print("DataSeeder: 10 products seeded.")
    }
}
