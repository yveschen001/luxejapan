// ScriptListItemView.swift
// 腳本清單項目 View：顯示腳本資訊與操作按鈕，符合 UI_GUIDELINES.md、SPEC.md
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 STYLE_GUIDE.md、UI_GUIDELINES.md 获取结构与命名规范

import SwiftUI

struct ScriptMetadata: Identifiable, Equatable {
    let id: UUID
    let name: String
    let executionCount: Int
    let lastExecutionDate: Date?
}

struct ScriptListItemView: View {
    let script: ScriptMetadata
    var onPlay: (() -> Void)?
    var onEdit: (() -> Void)?
    var onDelete: (() -> Void)?

    private var formattedDate: String {
        guard let date = script.lastExecutionDate else { return NSLocalizedString("never_executed", comment: "") }
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }

    var body: some View {
        HStack(spacing: 16) {
            VStack(alignment: .leading, spacing: 4) {
                Text(LocalizedStringKey(script.name))
                    .font(.headline)
                    .lineLimit(1)
                HStack(spacing: 12) {
                    Text(LocalizedStringKey("last_executed"))
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text(formattedDate)
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text(LocalizedStringKey("executed_count"))
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text("\(script.executionCount)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            Spacer()
            Button(action: { onPlay?() }, label: {
                Image(systemName: "play.fill")
                    .imageScale(.large)
                    .accessibilityIdentifier("play-button-\(script.id.uuidString)")
            })
            .buttonStyle(.borderedProminent)
            Button(action: { onEdit?() }, label: {
                Image(systemName: "pencil")
                    .imageScale(.large)
                    .accessibilityIdentifier("edit-button-\(script.id.uuidString)")
            })
            .buttonStyle(.bordered)
            Button(action: { onDelete?() }, label: {
                Image(systemName: "trash")
                    .imageScale(.large)
                    .accessibilityIdentifier("delete-button-\(script.id.uuidString)")
            })
            .buttonStyle(.bordered)
            .tint(.red)
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 16)
        .background(Color(nsColor: .windowBackgroundColor))
        .cornerRadius(8)
        .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
        .accessibilityElement(children: .combine)
        .frame(maxWidth: .infinity)
    }
}

// MARK: - 預覽

struct ScriptListItemView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            ScriptListItemView(
                script: ScriptMetadata(id: UUID(), name: "Test Script", executionCount: 5, lastExecutionDate: Date()),
                onPlay: {}, onEdit: {}, onDelete: {}
            )
            .previewLayout(.sizeThatFits)
            .preferredColorScheme(.light)
            ScriptListItemView(
                script: ScriptMetadata(id: UUID(), name: "測試腳本", executionCount: 0, lastExecutionDate: nil),
                onPlay: {}, onEdit: {}, onDelete: {}
            )
            .previewLayout(.sizeThatFits)
            .preferredColorScheme(.dark)
        }
    }
}
