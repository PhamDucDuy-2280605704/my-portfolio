import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Experience from "./Experience";
import education from "../../data/education";
import workExperience from "../../data/workExperience";
import certificates from "../../data/certificates";

function renderExperience() {
  return render(
    <MemoryRouter>
      <Experience />
    </MemoryRouter>,
  );
}

describe("Experience page", () => {
  it("hiển thị đủ học vấn từ data/education.js", () => {
    renderExperience();

    education.forEach((item) => {
      expect(screen.getByText(item.school)).toBeInTheDocument();
    });
  });

  it("hiển thị đủ kinh nghiệm làm việc từ data/workExperience.js", () => {
    renderExperience();

    workExperience.forEach((job) => {
      expect(screen.getByText(job.company)).toBeInTheDocument();
      expect(screen.getByText(job.role)).toBeInTheDocument();

      job.highlights.forEach((point) => {
        expect(screen.getByText(point)).toBeInTheDocument();
      });
    });
  });

  it("hiển thị điểm đánh giá thực tập nếu có", () => {
    renderExperience();

    const jobWithScore = workExperience.find((job) => job.score);
    if (jobWithScore) {
      expect(screen.getByText(`Đánh giá: ${jobWithScore.score}`)).toBeInTheDocument();
    }
  });

  it("bấm nút 'Xem Báo Cáo Thực Tập' sẽ mở modal xem PDF ngay trong trang (không mở tab mới)", async () => {
    const user = userEvent.setup();
    renderExperience();

    const jobWithReport = workExperience.find((job) => job.report);
    if (jobWithReport) {
      const expectedTitle = `Báo cáo thực tập - ${jobWithReport.company}`;

      expect(screen.queryByTitle(expectedTitle)).not.toBeInTheDocument();

      await user.click(screen.getByText(/Xem Báo Cáo Thực Tập/));

      const iframe = screen.getByTitle(expectedTitle);
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute("src", jobWithReport.report);
    }
  });

  it("hiển thị đủ chứng chỉ từ data/certificates.js", () => {
    renderExperience();

    certificates.forEach((cert) => {
      expect(screen.getByText(cert.name)).toBeInTheDocument();
    });
  });
});
