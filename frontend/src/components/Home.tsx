import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { FaBook, FaLaptopCode, FaGraduationCap } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
  <FaGraduationCap className="text-blue-600 w-10 h-10" />
  <span className="text-3xl font-bold">Tech Tute</span>
</div>
          {/* <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Tech Tute" className="h-10 w-10 object-cover rounded" />
            <span className="text-3xl font-[Cinzel]">Tech Tute</span>
          </div> */}

          {/* right: student auth */}
          <nav className="flex items-center gap-6">
            <Link to="/student/login" className="text-xl hover:opacity-80">Login</Link>
            <Link
              to="/student/signup"
              className="text-xl px-5 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
            >
              Signup
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-12 gap-8">
        {/* Left-side Tutor/Admin (desktop) */}
        <aside className="hidden lg:block col-span-2">
          <div className="sticky top-8 bg-white border rounded-2xl shadow-sm p-4 space-y-3">
            <h3 className="font-semibold">Staff Access</h3>
            <Link
              to="/tutor/login"
              className="block w-full text-left px-4 py-2 rounded-full border hover:bg-gray-50"
            >
              Tutor Login
            </Link>
            <Link
              to="/admin"
              className="block w-full text-left px-4 py-2 rounded-full border hover:bg-gray-50"
            >
              Admin Login
            </Link>
          </div>
        </aside>

        {/* Text column */}
        <div className="col-span-12 lg:col-span-5 flex items-center">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-5xl font-[Cinzel] leading-tight">
              Your Personal Tech Tutor, Anytime, Anywhere.
            </h1>

            <p className="text-xl md:text-2xl leading-relaxed">
              Join our tailored B.Tech Computer Science sessions designed to match your
              university syllabus, guided by top mentors.
            </p>

            <div>
              <Link
                to="/courses"
                className="inline-block text-xl px-6 py-3 rounded-full bg-[#49413F] text-white hover:opacity-90 transition"
              >
                Explore Courses
              </Link>
            </div>

            {/* Staff login (mobile) */}
            <div className="lg:hidden mt-6">
              <div className="bg-white border rounded-2xl p-4 flex gap-3">
                <Link to="/tutor/login" className="flex-1 text-center px-4 py-2 rounded-full border hover:bg-gray-50">
                  Tutor Login
                </Link>
                <Link to="/admin/login" className="flex-1 text-center px-4 py-2 rounded-full border hover:bg-gray-50">
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://sunknowledge.com/wp-content/uploads/2025/05/virtual-medical-scribes-the-key-to-faster-1000x550.jpg"
              alt="Student learning"
              className="w-full h-[420px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Footer (simple, like your Figma) */}
      <footer className="bg-[#DCE6F7] mt-12">
        <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 items-start">
          <div>
            <h4 className="font-[Cinzel] text-2xl mb-3">Usefull Links</h4>
            <ul className="space-y-2 text-lg">
              <li><Link to="/account" className="hover:underline">My Account</Link></li>
              <li><Link to="/courses" className="hover:underline">Courses</Link></li>
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
              <li><Link to="/blog" className="hover:underline">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-[Cinzel] text-2xl mb-3">Contacts</h4>
            <p className="text-lg leading-8">
              123 Tech Lane, 5th Floor, Vyttila<br />
              +91 98765 43210<br />
              support@techtute.com<br />
              www.techtute.com
            </p>
          </div>

          <div className="flex md:justify-end items-center gap-4">
            {/* <img src="/assets/social-fb.png" alt="facebook" className="h-10" />
            <img src="/assets/social-ig.png" alt="instagram" className="h-10" />
            <img src="/assets/social-tw.png" alt="twitter" className="h-10" />
            <img src="/assets/social-in.png" alt="linkedin" className="h-10" /> */}
            <div className="flex gap-4 text-gray-600">
      <a href="https://facebook.com" target="_blank" rel="noreferrer">
        <FacebookIcon fontSize="large" />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noreferrer">
        <InstagramIcon fontSize="large" />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noreferrer">
        <TwitterIcon fontSize="large" />
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noreferrer">
        <LinkedInIcon fontSize="large" />
      </a>
    </div>
          </div>
        </div>

        <div className="text-center pb-6 text-lg">
          © Copyright {new Date().getFullYear()} powered by Tech Tute
        </div>
      </footer>
    </div>
  );
}
