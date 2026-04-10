import CoreData

class CoreDataStack {

    static let shared = CoreDataStack()
    private init() {}

    // MARK: - Persistent Container

    lazy var persistentContainer: NSPersistentContainer = {
        let container = NSPersistentContainer(
            name: "ProductModel",
            managedObjectModel: CoreDataStack.buildManagedObjectModel()
        )
        container.loadPersistentStores { _, error in
            if let error = error {
                fatalError("Unresolved Core Data error: \(error.localizedDescription)")
            }
        }
        container.viewContext.automaticallyMergesChangesFromParent = true
        return container
    }()

    var context: NSManagedObjectContext {
        return persistentContainer.viewContext
    }

    // MARK: - Programmatic Model (no .xcdatamodeld file needed)

    static func buildManagedObjectModel() -> NSManagedObjectModel {
        let model = NSManagedObjectModel()

        let entity = NSEntityDescription()
        entity.name = "Product"
        entity.managedObjectClassName = "Product"

        func attribute(_ name: String, type: NSAttributeType, optional: Bool = true) -> NSAttributeDescription {
            let attr = NSAttributeDescription()
            attr.name = name
            attr.attributeType = type
            attr.isOptional = optional
            return attr
        }

        entity.properties = [
            attribute("productID",          type: .integer64AttributeType, optional: false),
            attribute("name",               type: .stringAttributeType),
            attribute("productDescription", type: .stringAttributeType),
            attribute("price",              type: .doubleAttributeType,  optional: false),
            attribute("provider",           type: .stringAttributeType)
        ]

        model.entities = [entity]
        return model
    }

    // MARK: - Save

    func saveContext() {
        let ctx = context
        guard ctx.hasChanges else { return }
        do {
            try ctx.save()
        } catch {
            print("Core Data save error: \(error.localizedDescription)")
        }
    }
}
