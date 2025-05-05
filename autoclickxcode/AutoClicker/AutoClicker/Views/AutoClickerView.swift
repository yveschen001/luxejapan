import SwiftUI

struct AutoClickerView: View {
    @StateObject private var viewModel = AutoClickerViewModel()
    
    var body: some View {
        VStack(spacing: 20) {
            Text("自動點擊器")
                .font(.title)
                .padding()
            
            HStack {
                Text("點擊間隔:")
                Slider(value: $viewModel.clickInterval, in: 0.1...5.0)
                Text(String(format: "%.1f秒", viewModel.clickInterval))
            }
            .padding(.horizontal)
            
            HStack {
                Text("點擊次數:")
                Text("\(viewModel.clickCount)")
                    .monospacedDigit()
            }
            .padding()
            
            Button(action: {
                if viewModel.isClicking {
                    viewModel.stopClicking()
                } else {
                    viewModel.startClicking()
                }
            }) {
                Text(viewModel.isClicking ? "停止" : "開始")
                    .frame(width: 100)
                    .padding()
                    .background(viewModel.isClicking ? Color.red : Color.green)
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
            
            Text("快捷鍵: ⌘ + Space")
                .font(.caption)
                .foregroundColor(.gray)
        }
        .frame(width: 300, height: 250)
        .padding()
    }
} 