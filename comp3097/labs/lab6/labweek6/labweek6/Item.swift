//
//  Item.swift
//  labweek6
//
//  Created by Daniel Digital on 2026-02-22.
//

import Foundation
import SwiftData

@Model
final class Item {
    var timestamp: Date
    
    init(timestamp: Date) {
        self.timestamp = timestamp
    }
}
