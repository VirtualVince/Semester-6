//
//  AppDelegate.swift
//  A2_iOS_vincente_101484793
//
//  Created by vs on 2026-04-09.
//

import UIKit
 
@main
class AppDelegate: UIResponder, UIApplicationDelegate {
 
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
 
        // Trigger Core Data stack + seed sample data
        _ = CoreDataStack.shared.persistentContainer
        DataSeeder.seedIfNeeded()
 
        return true
    }
 
    // MARK: UISceneSession Lifecycle
 
    func application(
        _ application: UIApplication,
        configurationForConnecting connectingSceneSession: UISceneSession,
        options: UIScene.ConnectionOptions
    ) -> UISceneConfiguration {
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }
}
