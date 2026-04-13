export interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNo: number;
  parentContact: string;
  email: string;
  gender: "Male" | "Female";
  dob: string;
  address: string;
  hostel?: string;
  transport?: string;
  avatar?: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: "present" | "absent";
}

export interface TimetableSlot {
  id: string;
  day: string;
  period: number;
  subject: string;
  teacher: string;
  class: string;
  section: string;
}

export interface Exam {
  id: string;
  name: string;
  type: "Mid-Term" | "Final" | "Unit Test";
  date: string;
  class: string;
  subjects: string[];
}

export interface ExamResult {
  examId: string;
  studentId: string;
  subject: string;
  marks: number;
  maxMarks: number;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  type: "Tuition" | "Hostel" | "Transport" | "Lab" | "Library";
  amount: number;
  status: "Paid" | "Pending";
  dueDate: string;
  paidDate?: string;
}

export interface HostelRoom {
  id: string;
  roomNo: string;
  block: string;
  capacity: number;
  occupants: string[];
}

export interface TransportRoute {
  id: string;
  routeName: string;
  busNo: string;
  stops: string[];
  capacity: number;
  assigned: string[];
}

export interface Circular {
  id: string;
  title: string;
  description: string;
  category: "Academic" | "Event" | "Urgent";
  date: string;
  author: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "Holiday" | "Exam" | "Event";
  description?: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "Cultural" | "Technical" | "Sports";
  venue: string;
  registeredStudents: string[];
  maxCapacity: number;
}

export interface LearningMaterial {
  id: string;
  title: string;
  subject: string;
  category: "Notes" | "Assignment" | "Recorded Lecture" | "Practice Quiz";
  class: string;
  uploadDate: string;
  fileType: "PDF" | "Video" | "Link";
  url: string;
  teacher: string;
}

// --- MOCK DATA ---

const names = [
  "Aarav Sharma", "Priya Patel", "Rohan Gupta", "Ananya Singh", "Vikram Reddy",
  "Sneha Joshi", "Arjun Kumar", "Kavya Nair", "Dev Mehta", "Isha Verma",
  "Rahul Iyer", "Pooja Das", "Nikhil Bhat", "Meera Rao", "Siddharth Kapoor",
  "Riya Chopra", "Karthik Menon", "Divya Saxena", "Aditya Jain", "Tanvi Kulkarni",
  "Manish Tiwari", "Shreya Agarwal", "Varun Pillai", "Neha Pandey", "Amit Deshmukh",
  "Sakshi Mishra", "Gaurav Sinha", "Pallavi Hegde", "Rajesh Nambiar", "Simran Kaur",
];

const classes = ["8", "9", "10", "11", "12"];
const sections = ["A", "B", "C"];

export const mockStudents: Student[] = names.map((name, i) => ({
  id: `STU${String(i + 1).padStart(3, "0")}`,
  name,
  class: classes[i % 5],
  section: sections[i % 3],
  rollNo: (i % 15) + 1,
  parentContact: `+91 ${9800000000 + i}`,
  email: `${name.toLowerCase().replace(/ /g, ".")}@school.edu`,
  gender: i % 3 === 1 ? "Female" : "Male",
  dob: `200${8 - (i % 5)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
  address: `${i + 10}, School Lane, City`,
}));

const teachers = ["Mr. Ramesh", "Ms. Lakshmi", "Mr. Suresh", "Ms. Deepa", "Mr. Hari", "Ms. Geetha"];
const subjects = ["Mathematics", "Physics", "Chemistry", "English", "Hindi", "Computer Science", "Biology", "History"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const mockTimetable: TimetableSlot[] = [];
classes.forEach((cls) => {
  sections.slice(0, 2).forEach((sec) => {
    days.forEach((day) => {
      for (let p = 1; p <= 7; p++) {
        mockTimetable.push({
          id: `TT-${cls}${sec}-${day}-${p}`,
          day,
          period: p,
          subject: subjects[(p + classes.indexOf(cls)) % subjects.length],
          teacher: teachers[(p + sections.indexOf(sec)) % teachers.length],
          class: cls,
          section: sec,
        });
      }
    });
  });
});

export const mockExams: Exam[] = [
  { id: "EX001", name: "Mid-Term 2026", type: "Mid-Term", date: "2026-05-05", class: "10", subjects: ["Mathematics", "Physics", "Chemistry", "English", "Hindi"] },
  { id: "EX002", name: "Unit Test 1", type: "Unit Test", date: "2026-04-20", class: "10", subjects: ["Mathematics", "Physics", "Chemistry"] },
  { id: "EX003", name: "Final 2025", type: "Final", date: "2026-03-10", class: "10", subjects: ["Mathematics", "Physics", "Chemistry", "English", "Hindi", "Computer Science"] },
  { id: "EX004", name: "Mid-Term 2026", type: "Mid-Term", date: "2026-05-05", class: "9", subjects: ["Mathematics", "Physics", "English", "Hindi"] },
];

export const mockExamResults: ExamResult[] = [];
mockExams.forEach((exam) => {
  mockStudents
    .filter((s) => s.class === exam.class)
    .forEach((s) => {
      exam.subjects.forEach((sub) => {
        mockExamResults.push({
          examId: exam.id,
          studentId: s.id,
          subject: sub,
          marks: Math.floor(Math.random() * 40) + 60,
          maxMarks: 100,
        });
      });
    });
});

export const mockFees: FeeRecord[] = mockStudents.flatMap((s, i) => [
  { id: `FEE-${s.id}-T`, studentId: s.id, type: "Tuition" as const, amount: 25000, status: (i % 3 === 0 ? "Pending" : "Paid") as "Paid" | "Pending", dueDate: "2026-04-30", paidDate: i % 3 === 0 ? undefined : "2026-04-01" },
  { id: `FEE-${s.id}-L`, studentId: s.id, type: "Lab" as const, amount: 5000, status: (i % 4 === 0 ? "Pending" : "Paid") as "Paid" | "Pending", dueDate: "2026-04-30", paidDate: i % 4 === 0 ? undefined : "2026-04-05" },
]);

export const mockHostelRooms: HostelRoom[] = Array.from({ length: 12 }, (_, i) => ({
  id: `HR${i + 1}`,
  roomNo: `${Math.floor(i / 4) + 1}${String((i % 4) + 1).padStart(2, "0")}`,
  block: ["A", "B", "C"][Math.floor(i / 4)],
  capacity: 3,
  occupants: mockStudents.slice(i * 2, i * 2 + (i % 3 === 0 ? 2 : i % 3 === 1 ? 3 : 1)).map((s) => s.id),
}));

export const mockTransportRoutes: TransportRoute[] = [
  { id: "TR1", routeName: "Route 1 - North City", busNo: "BUS-01", stops: ["Main Gate", "Central Park", "MG Road", "Station"], capacity: 40, assigned: mockStudents.slice(0, 8).map((s) => s.id) },
  { id: "TR2", routeName: "Route 2 - South City", busNo: "BUS-02", stops: ["Mall Road", "Lake View", "Hill Top", "Main Gate"], capacity: 40, assigned: mockStudents.slice(8, 15).map((s) => s.id) },
  { id: "TR3", routeName: "Route 3 - East City", busNo: "BUS-03", stops: ["Tech Park", "River Side", "Old Town", "Main Gate"], capacity: 35, assigned: mockStudents.slice(15, 20).map((s) => s.id) },
];

export const mockCirculars: Circular[] = [
  { id: "C1", title: "Mid-Term Exam Schedule", description: "Mid-term examinations will commence from May 5th. Detailed schedule attached.", category: "Academic", date: "2026-04-12", author: "Principal" },
  { id: "C2", title: "Annual Day Celebration", description: "Annual day will be celebrated on May 20th. All students to participate.", category: "Event", date: "2026-04-10", author: "Admin" },
  { id: "C3", title: "Updated Dress Code", description: "New dress code policy effective from May 1st. Please adhere strictly.", category: "Urgent", date: "2026-04-11", author: "Vice Principal" },
  { id: "C4", title: "Parent-Teacher Meeting", description: "PTM scheduled for April 25th. All parents requested to attend.", category: "Academic", date: "2026-04-09", author: "Admin" },
  { id: "C5", title: "Science Exhibition", description: "Inter-school science exhibition on April 28th. Register by April 20th.", category: "Event", date: "2026-04-08", author: "Science Dept" },
];

export const mockCalendarEvents: CalendarEvent[] = [
  { id: "CE1", title: "Good Friday", date: "2026-04-18", type: "Holiday" },
  { id: "CE2", title: "Unit Test 1", date: "2026-04-20", type: "Exam" },
  { id: "CE3", title: "PTM", date: "2026-04-25", type: "Event" },
  { id: "CE4", title: "Science Exhibition", date: "2026-04-28", type: "Event" },
  { id: "CE5", title: "May Day", date: "2026-05-01", type: "Holiday" },
  { id: "CE6", title: "Mid-Term Start", date: "2026-05-05", type: "Exam" },
  { id: "CE7", title: "Mid-Term End", date: "2026-05-12", type: "Exam" },
  { id: "CE8", title: "Annual Day", date: "2026-05-20", type: "Event" },
  { id: "CE9", title: "Summer Break", date: "2026-05-25", type: "Holiday" },
];

export const mockEvents: SchoolEvent[] = [
  { id: "EV1", title: "Annual Cultural Fest", description: "A grand celebration of art, music, dance, and drama.", date: "2026-05-20", type: "Cultural", venue: "Main Auditorium", registeredStudents: mockStudents.slice(0, 12).map((s) => s.id), maxCapacity: 100 },
  { id: "EV2", title: "Hackathon 2026", description: "24-hour coding challenge. Build innovative solutions.", date: "2026-04-28", type: "Technical", venue: "Computer Lab", registeredStudents: mockStudents.slice(5, 15).map((s) => s.id), maxCapacity: 50 },
  { id: "EV3", title: "Inter-School Cricket", description: "Annual inter-school cricket tournament.", date: "2026-05-10", type: "Sports", venue: "Sports Ground", registeredStudents: mockStudents.slice(0, 8).map((s) => s.id), maxCapacity: 30 },
  { id: "EV4", title: "Science Fair", description: "Showcase your scientific innovations and projects.", date: "2026-04-28", type: "Technical", venue: "Exhibition Hall", registeredStudents: mockStudents.slice(10, 20).map((s) => s.id), maxCapacity: 60 },
];

export const mockLearningMaterials: LearningMaterial[] = [
  { id: "LM1", title: "Algebra Fundamentals", subject: "Mathematics", category: "Notes", class: "10", uploadDate: "2026-04-01", fileType: "PDF", url: "#", teacher: "Mr. Ramesh" },
  { id: "LM2", title: "Newton's Laws", subject: "Physics", category: "Recorded Lecture", class: "10", uploadDate: "2026-04-03", fileType: "Video", url: "#", teacher: "Ms. Lakshmi" },
  { id: "LM3", title: "Periodic Table Quiz", subject: "Chemistry", category: "Practice Quiz", class: "10", uploadDate: "2026-04-05", fileType: "Link", url: "#", teacher: "Mr. Suresh" },
  { id: "LM4", title: "Essay Writing Tips", subject: "English", category: "Notes", class: "10", uploadDate: "2026-04-02", fileType: "PDF", url: "#", teacher: "Ms. Deepa" },
  { id: "LM5", title: "Trigonometry Assignment", subject: "Mathematics", category: "Assignment", class: "10", uploadDate: "2026-04-07", fileType: "PDF", url: "#", teacher: "Mr. Ramesh" },
  { id: "LM6", title: "Wave Optics", subject: "Physics", category: "Notes", class: "12", uploadDate: "2026-04-04", fileType: "PDF", url: "#", teacher: "Ms. Lakshmi" },
  { id: "LM7", title: "Organic Chemistry Basics", subject: "Chemistry", category: "Recorded Lecture", class: "12", uploadDate: "2026-04-06", fileType: "Video", url: "#", teacher: "Mr. Suresh" },
  { id: "LM8", title: "Python Programming", subject: "Computer Science", category: "Assignment", class: "11", uploadDate: "2026-04-08", fileType: "PDF", url: "#", teacher: "Mr. Hari" },
];

// Generate attendance for last 30 days
export const generateAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date("2026-04-13");
  for (let d = 0; d < 30; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    const day = date.getDay();
    if (day === 0) continue; // skip sundays
    const dateStr = date.toISOString().slice(0, 10);
    mockStudents.forEach((s) => {
      records.push({
        studentId: s.id,
        date: dateStr,
        status: Math.random() > 0.12 ? "present" : "absent",
      });
    });
  }
  return records;
};

export function getGrade(percentage: number): string {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
}
