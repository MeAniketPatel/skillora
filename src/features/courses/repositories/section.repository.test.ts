import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/shared/lib/prisma", () => ({
  default: {
    course: {
      findUnique: vi.fn(),
    },
    section: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));
vi.mock("@/shared/lib/errors", () => ({
  ForbiddenError: class ForbiddenError extends Error {
    constructor(m: string) {
      super(m);
      this.name = "ForbiddenError";
    }
  },
  NotFoundError: class NotFoundError extends Error {
    constructor(m: string) {
      super(m);
      this.name = "NotFoundError";
    }
  },
}));

import db from "@/shared/lib/prisma";
import { createSection } from "./section.repository";
import { ForbiddenError, NotFoundError } from "@/shared/lib/errors";

const mockedCourse = vi.mocked(db.course.findUnique);
const mockedFindFirst = vi.mocked(db.section.findFirst);
const mockedCreate = vi.mocked(db.section.create);

describe("createSection ownership", () => {
  beforeEach(() => {
    mockedCourse.mockReset();
    mockedFindFirst.mockReset();
    mockedCreate.mockReset();
    mockedFindFirst.mockResolvedValue(null);
    mockedCreate.mockImplementation((args: any) => Promise.resolve(args.data));
  });

  it("creates a section when no ownerId is supplied (back-compat)", async () => {
    await createSection("c1", "Intro");
    expect(mockedCourse).not.toHaveBeenCalled();
    expect(mockedCreate).toHaveBeenCalledWith({
      data: { title: "Intro", courseId: "c1", position: 1 },
    });
  });

  it("creates a section when ownerId matches teacherId", async () => {
    mockedCourse.mockResolvedValue({ teacherId: "t1" } as never);
    await createSection("c1", "Intro", "t1");
    expect(mockedCreate).toHaveBeenCalled();
  });

  it("throws NotFoundError when the course doesn't exist", async () => {
    mockedCourse.mockResolvedValue(null);
    await expect(createSection("c1", "Intro", "t1")).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("throws ForbiddenError when the caller is not the course owner", async () => {
    mockedCourse.mockResolvedValue({ teacherId: "t1" } as never);
    await expect(createSection("c1", "Intro", "attacker")).rejects.toBeInstanceOf(
      ForbiddenError,
    );
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("uses the next position based on the last section", async () => {
    mockedCourse.mockResolvedValue({ teacherId: "t1" } as never);
    mockedFindFirst.mockResolvedValue({ position: 4 } as never);
    await createSection("c1", "Intro", "t1");
    expect(mockedCreate).toHaveBeenCalledWith({
      data: { title: "Intro", courseId: "c1", position: 5 },
    });
  });
});
