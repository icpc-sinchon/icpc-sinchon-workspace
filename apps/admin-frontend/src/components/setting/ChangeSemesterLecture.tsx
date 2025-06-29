import { useCallback, useEffect, useState } from "react";

import {
  Card,
  Flex,
  Heading,
  Text,
  Button,
  TextField,
  AlertDialog,
  Tooltip,
} from "@radix-ui/themes";
import { SettingTab } from "@/components/setting/SettingItem";
import type { BOJProblem, Lecture, Task } from "@/types/setting";
import { adminAPI } from "@/utils/api";
import EditableInput from "../EditableInput";
import { API_URL } from "@/types/apis";
import { useSemester } from "@/contexts/SemesterContext";
import BOJProblemBadge from "../ProblemBadge";

function TaskDisplay({
  task,
  onTaskChange,
}: {
  task: Task;
  onTaskChange: (updatedTask: Task) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [newProblemNumber, setNewProblemNumber] = useState("");

  // 수정이 끝나면 저장
  const handleEdit = async () => {
    if (isEditing) {
      onTaskChange(editedTask);
      const updateResult = await adminAPI.patch(API_URL.TASK.byId(task.id), {
        minSolveCount: editedTask.minSolveCount,
        practiceId: editedTask.practiceId,
        problems: editedTask.problems.map((problem) => ({
          bojProblemNumber: problem.bojProblemNumber,
          essential: problem.essential,
          taskId: problem.taskId,
        })),
      });
      console.log("task update result: ", updateResult);
    }

    setIsEditing(!isEditing);
  };

  const handleAddProblem = () => {
    const problemNumber = Number.parseInt(newProblemNumber, 10);
    if (!Number.isNaN(problemNumber)) {
      const newProblem: BOJProblem = {
        id: Date.now(),
        taskId: task.id,
        bojProblemNumber: problemNumber,
        essential: true,
      };
      setEditedTask((prev) => ({
        ...prev,
        problems: [...prev.problems, newProblem],
      }));
      setNewProblemNumber("");
    }
  };

  const handleProblemEssentialChange = (problemId: number) => {
    setEditedTask((prev) => ({
      ...prev,
      problems: prev.problems.map((p) =>
        p.id === problemId ? { ...p, essential: !p.essential } : p,
      ),
    }));
  };

  const handleDeleteProblem = (problemId: number) => {
    setEditedTask((prev) => ({
      ...prev,
      problems: prev.problems.filter((p) => p.id !== problemId),
    }));
  };

  const handleMinSolveCountChange = (value: string) => {
    setEditedTask((prev) => ({
      ...prev,
      minSolveCount: Number.parseInt(value, 10) || 0,
    }));
  };

  const handlePracticeIdChange = (value: string) => {
    setEditedTask((prev) => ({
      ...prev,
      practiceId: Number.parseInt(value, 10) || 0,
    }));
  };

  return (
    <Card>
      <Flex direction="column" gap="0.5rem">
        <Flex align="center" justify="between">
          <Heading as="h4" size="4">
            {task.round}회차
          </Heading>
          <Button size="1" onClick={handleEdit} type="button">
            {isEditing ? "저장" : "수정"}
          </Button>
        </Flex>
        <EditableInput
          type="number"
          label="출석 인정 필수문제 수"
          value={editedTask.minSolveCount.toString()}
          onChange={handleMinSolveCountChange}
          isEditing={isEditing}
        />
        <EditableInput
          type="number"
          label="BOJ 그룹 내 연습 ID"
          value={editedTask.practiceId.toString()}
          onChange={handlePracticeIdChange}
          isEditing={isEditing}
          helpertext="그룹 연습에서 그룹 ID 다음에 오는 번호. 예를 들어 연습 주소가 https://www.acmicpc.net/group/practice/view/21486/1 이면 1을 입력하세요."
        />
        <Flex direction="row" gap="0.5rem">
          <Text size="3">연습 문제 목록</Text>
          <Tooltip
            content="필수 문제는 초록색으로 표시됩니다. 수정 상태에서 클릭 시 필수 문제 여부를 바꿀 수 있습니다."
            side="right"
          >
            <Button size="1" type="button">
              ?
            </Button>
          </Tooltip>
        </Flex>

        <Flex direction="row" gap="0.5rem">
          {editedTask.problems.map((problem) => (
            <BOJProblemBadge
              key={problem.id}
              bojProblemNumber={problem.bojProblemNumber}
              onDelete={() => handleDeleteProblem(problem.id)}
              isEditing={isEditing}
              essential={problem.essential}
              onClick={() => handleProblemEssentialChange(problem.id)}
            />
          ))}
          {isEditing && (
            <Flex align="center" gap="0.5rem">
              <TextField.Root
                type="number"
                value={newProblemNumber}
                onChange={(e) => setNewProblemNumber(e.target.value)}
                placeholder="새 문제 번호"
              />
              <Button size="1" onClick={handleAddProblem} type="button">
                추가
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Card>
  );
}

function LectureDisplay({
  lecture,
  onLectureChange,
  onDelete,
}: {
  lecture: Lecture;
  onLectureChange: (updatedLecture: Lecture) => void;
  onDelete?: (lectureId: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLecture, setEditedLecture] = useState(lecture);

  const handleEdit = async () => {
    if (isEditing) {
      onLectureChange(editedLecture);
      const res = await adminAPI.patch(API_URL.LECTURE.byId(lecture.id), {
        bojGroupId: editedLecture.bojGroupId,
        lectureNumber: editedLecture.lectureNumber,
      });
      console.log(res);
    }
    setIsEditing(!isEditing);
  };

  const handleDelete = async () => {
    try {
      await adminAPI.delete(API_URL.LECTURE.byId(lecture.id));
      onDelete?.(lecture.id);
    } catch (error) {
      console.error("Failed to delete lecture:", error);
      // 에러 처리를 추가할 수 있습니다
    }
  };

  const handleChange = (field: keyof Lecture, value: string) => {
    setEditedLecture((prev) => ({
      ...prev,
      [field]: Number.parseInt(value, 10),
    }));
  };

  const handleTaskChange = (updatedTask: Task) => {
    setEditedLecture((prev) => ({
      ...prev,
      tasks: prev.task.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    }));
  };

  return (
    <Card>
      <Flex direction="column" gap="0.5rem">
        <Flex align="center" justify="between">
          <Heading as="h3" size="4">
            {lecture.level}
          </Heading>
          <Flex gap="0.5rem">
            <Button size="1" onClick={handleEdit} type="button">
              {isEditing ? "저장" : "수정"}
            </Button>
            <AlertDialog.Root>
              <AlertDialog.Trigger>
                <Button size="1" color="red">
                  삭제
                </Button>
              </AlertDialog.Trigger>
              <AlertDialog.Content>
                <AlertDialog.Title>강의 삭제</AlertDialog.Title>
                <AlertDialog.Description>
                  정말로 {lecture.level} 강의를 삭제하시겠습니까? 이 작업은
                  되돌릴 수 없습니다.
                </AlertDialog.Description>
                <Flex gap="3" mt="4" justify="end">
                  <AlertDialog.Cancel>
                    <Button variant="soft" color="gray">
                      취소
                    </Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action>
                    <Button variant="solid" color="red" onClick={handleDelete}>
                      삭제
                    </Button>
                  </AlertDialog.Action>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </Flex>
        </Flex>
        <EditableInput
          type="number"
          label="강의 회차수"
          value={editedLecture.lectureNumber.toString()}
          onChange={(value) => handleChange("lectureNumber", value)}
          isEditing={isEditing}
        />
        <EditableInput
          type="number"
          label="BOJ 그룹 ID"
          value={editedLecture.bojGroupId.toString()}
          onChange={(value) => handleChange("bojGroupId", value)}
          isEditing={isEditing}
          helpertext="그룹 주소의 숫자 부분. 예를 들어 강의에 쓰이는 BOJ 주소가 https://www.acmicpc.net/group/21486 이면 21486을 입력하세요."
        />
        <Text size="3">과제 목록</Text>
        {editedLecture.task.map((task) => (
          <TaskDisplay
            key={task.id}
            task={task}
            onTaskChange={handleTaskChange}
          />
        ))}
      </Flex>
    </Card>
  );
}

// 현재 학기의 강의들을 편집
// TODO: 강의 편집시 데이터가 바뀌는 기능?
function ChangeSemesterLecture() {
  const { currentSemester } = useSemester();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLectures = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.get<Lecture[]>(API_URL.LECTURE.BASE, {
        params: {
          year: currentSemester.year,
          season: currentSemester.season,
        },
      });
      console.log(response.data);
      setLectures(response.data);
    } catch (err) {
      setError("강의 정보를 불러오는데 실패했습니다.");
      console.error("Error fetching lectures:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentSemester]);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  const handleLectureChange = (updatedLecture: Lecture) => {
    setLectures((prevLectures) =>
      prevLectures.map((lecture) =>
        lecture.id === updatedLecture.id ? updatedLecture : lecture,
      ),
    );
  };

  const handleLectureDelete = (lectureId: number) => {
    setLectures((prevLectures) =>
      prevLectures.filter((lecture) => lecture.id !== lectureId),
    );
  };

  const formattedCurrentSemester = `${currentSemester.year}-${currentSemester.season}`;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading lectures</div>;

  return (
    <SettingTab tabTitle="강의 정보 변경" onSubmit={async () => {}}>
      <Text as="label" weight="bold">
        현재 학기 : {formattedCurrentSemester}
      </Text>
      {lectures.map((lecture) => (
        <LectureDisplay
          key={lecture.id}
          lecture={lecture}
          onLectureChange={handleLectureChange}
          onDelete={handleLectureDelete}
        />
      ))}
    </SettingTab>
  );
}
export default ChangeSemesterLecture;
