import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FiArrowRight,
  FiCheckCircle,
  FiUsers,
  FiDollarSign,
  FiShield,
  FiBarChart2,
  FiCreditCard,
  FiClock,
  FiSmartphone,
  FiGlobe,
  FiTrendingUp,
  FiAward,
  FiHeadphones,
  FiLock,
  FiCalendar,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaGooglePlay,
  FaAppStore,
} from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = [
        "home",
        "features",
        "how-it-works",
        "testimonials",
        "contact",
      ];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onSubmit = async (data) => {
    console.log("Lead captured:", data);
    // API call to save lead
    // Show success message
  };

  const features = [
    {
      icon: <FiUsers className="text-3xl" />,
      title: "Member Management",
      description:
        "Complete member lifecycle management with digital onboarding, KYC verification, and document management.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <FiDollarSign className="text-3xl" />,
      title: "Savings Management",
      description:
        "Multiple savings schemes, automatic interest calculation, withdrawal processing, and savings statements.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <FiCreditCard className="text-3xl" />,
      title: "Loan Management",
      description:
        "End-to-end loan processing from application to disbursement with automated EMI calculations.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <FiBarChart2 className="text-3xl" />,
      title: "Financial Reports",
      description:
        "Comprehensive financial reports, audit trails, and real-time analytics dashboard.",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: <FiShield className="text-3xl" />,
      title: "Security & Compliance",
      description:
        "Bank-grade security, role-based access control, and regulatory compliance features.",
      color: "from-red-500 to-red-600",
    },
    {
      icon: <FiClock className="text-3xl" />,
      title: "24/7 Availability",
      description:
        "Cloud-based system accessible anytime, anywhere with mobile app support.",
      color: "from-teal-500 to-teal-600",
    },
  ];

  const testimonials = [
    {
      name: "James Okon",
      role: "Chairman, Progressive Cooperative",
      content:
        "This system transformed our operations. We reduced manual work by 80% and improved member satisfaction significantly.",
      rating: 5,
    },
    {
      name: "Sarah Adeyemi",
      role: "Treasurer, Farmers Cooperative",
      content:
        "The loan management module is exceptional. It streamlined our entire lending process and reduced defaults by 40%.",
      rating: 5,
    },
    {
      name: "Michael Chukwu",
      role: "Member, Unity Cooperative",
      content:
        "As a member, I love the convenience. I can check my savings, apply for loans, and get statements from my phone.",
      rating: 5,
    },
  ];

  const stats = [
    { value: "500+", label: "Cooperatives Served" },
    { value: "2M+", label: "Members Managed" },
    { value: "₦50B+", label: "Total Transactions" },
    { value: "99.9%", label: "Uptime Guarantee" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-lg py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <FiDollarSign className="text-white text-xl" />
                </div>
                <div>
                  <h1
                    className={`text-2xl font-bold ${
                      scrolled ? "text-gray-800" : "text-white"
                    }`}
                  >
                    Coop<span className="text-blue-600">Finance</span>
                  </h1>
                  <p
                    className={`text-xs ${scrolled ? "text-gray-600" : "text-blue-100"}`}
                  >
                    Management System
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                "Features",
                "How it Works",
                "Pricing",
                "Testimonials",
                "Contact",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className={`font-medium transition-colors ${
                    scrolled
                      ? "text-gray-700 hover:text-blue-600"
                      : "text-white hover:text-blue-200"
                  }`}
                >
                  {item}
                </a>
              ))}
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`px-5 py-2 rounded-lg font-medium transition-all ${
                    scrolled
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-white hover:text-blue-200"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden">
              <svg
                className={`w-6 h-6 ${scrolled ? "text-gray-800" : "text-white"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-white">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <FiAward className="mr-2" />
                <span className="text-sm font-medium">
                  Trusted by 500+ Cooperatives
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Modern Cooperative
                <span className="block text-blue-200">Management System</span>
              </h1>

              <p className="text-xl text-blue-100 mb-8 max-w-2xl">
                Streamline your cooperative society operations with our
                all-in-one digital platform. Manage members, savings, loans, and
                financial reporting with ease.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={() => navigate("/register")}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                >
                  Start Free Trial
                  <FiArrowRight className="ml-2" />
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold text-lg hover:bg-white/20 border border-white/20 transition-all duration-300 flex items-center justify-center">
                  <FiSmartphone className="mr-2" />
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Form/Image */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Request a Demo
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <input
                      {...register("name", { required: true })}
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.name && (
                      <span className="text-red-300 text-sm">
                        Name is required
                      </span>
                    )}
                  </div>
                  <div>
                    <input
                      {...register("email", { required: true })}
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.email && (
                      <span className="text-red-300 text-sm">
                        Email is required
                      </span>
                    )}
                  </div>
                  <div>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      {...register("cooperative")}
                      type="text"
                      placeholder="Cooperative Name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                  >
                    Request Free Demo
                  </button>
                </form>
                <p className="text-blue-200 text-sm mt-4 text-center">
                  No credit card required • 14-day free trial
                </p>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500 rounded-2xl -rotate-12 opacity-30"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500 rounded-3xl rotate-12 opacity-30"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              Features
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Everything You Need to Manage Your Cooperative
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive features designed specifically for cooperative
              societies and financial institutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button className="text-blue-600 font-medium flex items-center hover:text-blue-700">
                    Learn More
                    <FiArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-4">
              Process
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Simple & Efficient Workflow
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes with our streamlined implementation process
            </p>
          </div>

          <div className="relative">
            {/* Timeline */}
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  number: "01",
                  title: "Sign Up",
                  description: "Create your account in minutes",
                },
                {
                  number: "02",
                  title: "Onboarding",
                  description: "Our team helps you get set up",
                },
                {
                  number: "03",
                  title: "Import Data",
                  description: "Migrate your existing data",
                },
                {
                  number: "04",
                  title: "Go Live",
                  description: "Start managing your cooperative",
                },
              ].map((step, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-10 left-3/4 w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-100"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 bg-gradient-to-br from-gray-900 to-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold mb-4">
              Testimonials
            </span>
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Cooperative Societies
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See what our clients say about our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              >
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiCheckCircle key={i} className="text-yellow-400 mr-1" />
                  ))}
                </div>
                <p className="text-gray-200 text-lg mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{testimonial.name}</h4>
                    <p className="text-blue-200 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Cooperative?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of cooperative societies that trust our platform for
            their daily operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            >
              Start Free Trial
              <FiArrowRight className="ml-2" />
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center">
              <FiHeadphones className="mr-2" />
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <FiDollarSign className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">CoopFinance</h2>
                  <p className="text-gray-400 text-sm">Management System</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6">
                Modern cooperative society management platform for financial
                institutions across Africa.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors"
                >
                  <FaTwitter />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#home"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-bold mb-6">Features</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-400">
                  <FiCheckCircle className="mr-2 text-green-500" />
                  Member Management
                </li>
                <li className="flex items-center text-gray-400">
                  <FiCheckCircle className="mr-2 text-green-500" />
                  Loan Processing
                </li>
                <li className="flex items-center text-gray-400">
                  <FiCheckCircle className="mr-2 text-green-500" />
                  Savings Management
                </li>
                <li className="flex items-center text-gray-400">
                  <FiCheckCircle className="mr-2 text-green-500" />
                  Financial Reporting
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-400">
                  <FiMapPin className="mr-3 text-blue-500" />
                  <span>123 Business Street, Lagos, Nigeria</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <FiPhone className="mr-3 text-blue-500" />
                  <span>+234 812 345 6789</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <FiMail className="mr-3 text-blue-500" />
                  <span>support@coopfinance.com</span>
                </li>
              </ul>

              {/* Mobile Apps */}
              <div className="mt-8">
                <h4 className="text-lg font-bold mb-4">Mobile Apps</h4>
                <div className="flex space-x-3">
                  <button className="flex items-center px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <FaGooglePlay className="mr-2" />
                    Google Play
                  </button>
                  <button className="flex items-center px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <FaAppStore className="mr-2" />
                    App Store
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} CoopFinance. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
