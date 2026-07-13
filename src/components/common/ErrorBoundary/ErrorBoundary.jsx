import { Component } from "react";

import "./ErrorBoundary.css";

// Error Boundary BẮT BUỘC phải là class component — React (kể cả bản 19)
// chưa có hook tương đương cho getDerivedStateFromError/componentDidCatch.
//
// Vai trò: nếu bất kỳ component con nào throw lỗi lúc render (bug, dữ liệu
// null không lường trước...), React mặc định sẽ unmount TOÀN BỘ cây component
// -> người dùng thấy màn hình trắng trơn, không rõ chuyện gì xảy ra.
// Bọc <ErrorBoundary> quanh App để bắt lỗi đó lại, hiện màn hình thân thiện
// kèm nút "Tải lại trang" thay vì crash im lặng.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Trong dự án thật có thể gửi lỗi này tới dịch vụ theo dõi lỗi
    // (Sentry, LogRocket...). Ở đây tạm log ra console để dev thấy khi debug.
    console.error("ErrorBoundary bắt được lỗi:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>😵 Đã có lỗi xảy ra</h1>
          <p>Trang gặp sự cố không mong muốn. Bạn thử tải lại trang xem sao nhé.</p>

          <button
            type="button"
            className="error-boundary-button"
            onClick={this.handleReload}
          >
            Tải Lại Trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
