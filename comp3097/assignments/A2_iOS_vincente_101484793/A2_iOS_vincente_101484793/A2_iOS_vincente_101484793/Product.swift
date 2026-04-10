//
//  Product.swift
//  A2_iOS_vincente_101484793
//
//  Created by vs on 2026-04-09.
//

import CoreData
 
@objc(Product)
class Product: NSManagedObject {
    @NSManaged var productID: Int64
    @NSManaged var name: String?
    @NSManaged var productDescription: String?
    @NSManaged var price: Double
    @NSManaged var provider: String?
}
 
extension Product {
    @nonobjc static func fetchRequest() -> NSFetchRequest<Product> {
        return NSFetchRequest<Product>(entityName: "Product")
    }
 
    var displayName: String        { name ?? "Unnamed Product" }
    var displayDescription: String { productDescription ?? "No description available." }
    var displayProvider: String    { provider ?? "Unknown Provider" }
    var displayPrice: String       { String(format: "$%.2f", price) }
}
