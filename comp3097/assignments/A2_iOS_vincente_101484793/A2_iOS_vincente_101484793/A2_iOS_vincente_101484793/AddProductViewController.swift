//
//  AddProductViewController.swift
//  A2_iOS_vincente_101484793
//
//  Created by vs on 2026-04-09.
//

import UIKit
import CoreData

class AddProductViewController: UIViewController {
 
    // MARK: - UI
 
    private let scrollView  = UIScrollView()
    private let contentView = UIView()
 
    private let nameField        = AddProductViewController.makeField(placeholder: "Product Name")
    private let descriptionField = AddProductViewController.makeTextView()
    private let priceField       = AddProductViewController.makeField(placeholder: "Price (e.g. 29.99)", keyboard: .decimalPad)
    private let providerField    = AddProductViewController.makeField(placeholder: "Provider / Brand")
 
    private lazy var saveButton: UIButton = {
        var config = UIButton.Configuration.filled()
        config.title           = "Save Product"
        config.cornerStyle     = .large
        config.baseBackgroundColor = .systemBlue
        let b = UIButton(configuration: config)
        b.translatesAutoresizingMaskIntoConstraints = false
        b.addTarget(self, action: #selector(saveTapped), for: .touchUpInside)
        return b
    }()
 
    // MARK: - Lifecycle
 
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Add Product"
        view.backgroundColor = .systemBackground
        setupKeyboardDismiss()
        setupUI()
        registerForKeyboardNotifications()
    }
 
    deinit { NotificationCenter.default.removeObserver(self) }
 
    // MARK: - Save Action
 
    @objc private func saveTapped() {
        guard let name = nameField.text, !name.trimmingCharacters(in: .whitespaces).isEmpty else {
            showAlert("Missing Field", message: "Product Name is required.")
            return
        }
        let priceText = priceField.text?.trimmingCharacters(in: .whitespaces) ?? ""
        guard let price = Double(priceText), price >= 0 else {
            showAlert("Invalid Price", message: "Enter a valid price (e.g. 29.99).")
            return
        }
 
        let ctx = CoreDataStack.shared.context
 
        // Auto-generate next ID
        let fetchRequest: NSFetchRequest<Product> = Product.fetchRequest()
        let allProducts = (try? ctx.fetch(fetchRequest)) ?? []
        let nextID = Int64((allProducts.map { $0.productID }.max() ?? 0) + 1)
 
        let product = Product(context: ctx)
        product.productID          = nextID
        product.name               = name.trimmingCharacters(in: .whitespaces)
        product.productDescription = descriptionField.text.trimmingCharacters(in: .whitespacesAndNewlines)
        product.price              = price
        product.provider           = providerField.text?.trimmingCharacters(in: .whitespaces)
 
        CoreDataStack.shared.saveContext()
 
        showAlert("Saved", message: "\"\(name)\" has been added to your products.") { [weak self] in
            self?.clearForm()
        }
    }
 
    // MARK: - Helpers
 
    private func clearForm() {
        [nameField, priceField, providerField].forEach { $0.text = "" }
        descriptionField.text = ""
    }
 
    private func showAlert(_ title: String, message: String, completion: (() -> Void)? = nil) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completion?() })
        present(alert, animated: true)
    }
 
    private func setupKeyboardDismiss() {
        let tap = UITapGestureRecognizer(target: view, action: #selector(UIView.endEditing(_:)))
        view.addGestureRecognizer(tap)
    }
 
    // MARK: - Keyboard Avoidance
 
    private func registerForKeyboardNotifications() {
        NotificationCenter.default.addObserver(self,
            selector: #selector(keyboardWillShow(_:)),
            name: UIResponder.keyboardWillShowNotification, object: nil)
        NotificationCenter.default.addObserver(self,
            selector: #selector(keyboardWillHide(_:)),
            name: UIResponder.keyboardWillHideNotification, object: nil)
    }
 
    @objc private func keyboardWillShow(_ n: Notification) {
        guard let frame = n.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? CGRect else { return }
        scrollView.contentInset.bottom = frame.height + 20
    }
 
    @objc private func keyboardWillHide(_ n: Notification) {
        scrollView.contentInset.bottom = 0
    }
 
    // MARK: - Layout
 
    private func setupUI() {
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        contentView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
 
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
 
            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor)
        ])
 
        let descContainer = makeDescriptionContainer()
 
        let formStack = UIStackView(arrangedSubviews: [
            makeFieldGroup(label: "Product Name *", field: nameField),
            makeFieldGroup(label: "Description",    field: descContainer),
            makeFieldGroup(label: "Price *",         field: priceField),
            makeFieldGroup(label: "Provider",        field: providerField)
        ])
        formStack.axis    = .vertical
        formStack.spacing = 20
        formStack.translatesAutoresizingMaskIntoConstraints = false
 
        contentView.addSubview(formStack)
        contentView.addSubview(saveButton)
 
        NSLayoutConstraint.activate([
            formStack.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 24),
            formStack.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            formStack.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
 
            saveButton.topAnchor.constraint(equalTo: formStack.bottomAnchor, constant: 32),
            saveButton.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            saveButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            saveButton.heightAnchor.constraint(equalToConstant: 52),
            saveButton.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -32)
        ])
    }
 
    private func makeDescriptionContainer() -> UIView {
        descriptionField.font = .systemFont(ofSize: 16)
        descriptionField.layer.borderColor = UIColor.systemGray4.cgColor
        descriptionField.layer.borderWidth = 1
        descriptionField.layer.cornerRadius = 10
        descriptionField.textContainerInset = UIEdgeInsets(top: 12, left: 8, bottom: 12, right: 8)
        descriptionField.heightAnchor.constraint(equalToConstant: 100).isActive = true
        descriptionField.translatesAutoresizingMaskIntoConstraints = false
        return descriptionField
    }
 
    private func makeFieldGroup(label text: String, field: UIView) -> UIView {
        let label = UILabel()
        label.text = text
        label.font = .systemFont(ofSize: 13, weight: .medium)
        label.textColor = .secondaryLabel
 
        let stack = UIStackView(arrangedSubviews: [label, field])
        stack.axis    = .vertical
        stack.spacing = 6
        return stack
    }
 
    // MARK: - Factory Methods
 
    private static func makeField(placeholder: String,
                                  keyboard: UIKeyboardType = .default) -> UITextField {
        let tf = UITextField()
        tf.placeholder      = placeholder
        tf.borderStyle      = .roundedRect
        tf.keyboardType     = keyboard
        tf.font             = .systemFont(ofSize: 16)
        tf.heightAnchor.constraint(equalToConstant: 44).isActive = true
        return tf
    }
 
    private static func makeTextView() -> UITextView {
        let tv = UITextView()
        tv.font = .systemFont(ofSize: 16)
        return tv
    }
}
