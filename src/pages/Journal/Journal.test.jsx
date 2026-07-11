import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Journal from "./Journal";
import journal from "../../data/journal";

function renderJournal() {
  return render(
    <MemoryRouter>
      <Journal />
    </MemoryRouter>,
  );
}

describe("Journal page", () => {
  it("mặc định chỉ hiện phần tóm tắt (excerpt), chưa hiện nội dung đầy đủ", () => {
    renderJournal();

    const firstEntry = journal[0];

    expect(screen.getByText(firstEntry.excerpt)).toBeInTheDocument();
    expect(screen.queryByText(firstEntry.content[0])).not.toBeInTheDocument();
  });

  it("bấm 'Đọc tiếp' sẽ hiện nội dung đầy đủ của đúng bài đó", async () => {
    const user = userEvent.setup();
    renderJournal();

    const firstEntry = journal[0];
    const toggleButtons = screen.getAllByText(/Đọc tiếp/);

    await user.click(toggleButtons[0]);

    expect(screen.getByText(firstEntry.content[0])).toBeInTheDocument();
    // Nút chuyển thành "Thu gọn" sau khi mở
    expect(screen.getAllByText(/Thu gọn/).length).toBeGreaterThan(0);
  });

  it("hiển thị đủ số lượng bài viết trong data/journal.js", () => {
    renderJournal();

    journal.forEach((entry) => {
      expect(screen.getByText(entry.title)).toBeInTheDocument();
    });
  });
});
