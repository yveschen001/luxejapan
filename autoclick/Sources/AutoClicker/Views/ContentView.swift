import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = AutoClickerViewModel()

    var body: some View {
        VStack(spacing: 20) {
            Text("自动点击器")
                .font(.title)
                .fontWeight(.bold)

            HStack {
                Text("点击间隔(秒):")
                TextField("", value: $viewModel.clickInterval, format: .number)
                    .frame(width: 60)
                    .textFieldStyle(.roundedBorder)
            }

            HStack {
                Text("点击次数:")
                TextField("", value: $viewModel.clickCount, format: .number)
                    .frame(width: 60)
                    .textFieldStyle(.roundedBorder)
                Text("(0 表示无限)")
                    .font(.caption)
                    .foregroundColor(.gray)
            }

            Button(action: viewModel.toggleClicking, label: {
                Text(viewModel.isClicking ? "停止" : "开始")
                    .frame(width: 100)
            })
            .buttonStyle(.borderedProminent)

            Text("状态: \(viewModel.statusText)")
                .foregroundColor(viewModel.isClicking ? .green : .primary)
        }
        .padding()
        .frame(width: 300, height: 250)
    }
}
