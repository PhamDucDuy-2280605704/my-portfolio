import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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

  it("hiển thị link 'Tải Báo Cáo Thực Tập' đúng href và có thuộc tính download", () => {
    renderExperience();

    const jobWithReport = workExperience.find((job) => job.report);
    if (jobWithReport) {
      const reportLink = screen.getByText(/Tải Báo Cáo Thực Tập/).closest("a");
      expect(reportLink).toHaveAttribute("href", jobWithReport.report);
      expect(reportLink).toHaveAttribute("download");
    }
  });

  it("hiển thị đủ chứng chỉ từ data/certificates.js", () => {
    renderExperience();

    certificates.forEach((cert) => {
      expect(screen.getByText(cert.name)).toBeInTheDocument();
    });
  });
});
