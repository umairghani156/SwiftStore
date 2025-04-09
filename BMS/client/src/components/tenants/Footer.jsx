import React from "react";
import { FaFacebookSquare, FaTwitterSquare, FaInstagramSquare, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const Footer = () => {
  const { isDarkMode } = useTheme();

  const socialLinks = [
    { icon: <FaFacebookSquare />, href: "https://facebook.com", label: "Facebook" },
    { icon: <FaTwitterSquare />, href: "https://twitter.com", label: "Twitter" },
    { icon: <FaInstagramSquare />, href: "https://instagram.com", label: "Instagram" },
    { icon: <FaLinkedin />, href: "https://linkedin.com", label: "LinkedIn" }
  ];

  const quickLinks = [
    { href: "/contact-support", label: "Contact Support" },
    { href: "/faq", label: "FAQ" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" }
  ];

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      label: "Building Address",
      value: "Zaitoon Ashraf IT Park, near Korangi Road, Mehmood Abad, Karachi"
    },
    {
      icon: <FaPhone />,
      label: "Emergency Contact",
      value: "+1 (800) 123-4567"
    },
    {
      icon: <FaEnvelope />,
      label: "Building Management",
      value: "+1 (800) 987-6543"
    }
  ];

  return (
    <footer className={`mt-auto ${
      isDarkMode 
        ? 'bg-gray-900 text-gray-100 border-t border-gray-800' 
        : 'bg-gradient-to-r from-[#1A415A] to-[#4C6B7F] text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={link.href}
                    className={`text-sm hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2 ${
                      isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-100 hover:text-blue-300'
                    }`}
                  >
                    <span>→</span>
                    <span>{link.label}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Building Contact</h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.li
                  key={index}
                  className="flex items-start space-x-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className={`mt-1 flex-shrink-0 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-300'
                  }`}>
                    {info.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-100'
                    }`}>
                      {info.label}
                    </p>
                    <p className="text-sm mt-1 break-words">
                      {info.value}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className={`text-2xl transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-blue-400' 
                      : 'text-gray-100 hover:text-blue-300'
                  }`}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-sm">
                Stay connected with us on social media for the latest updates and announcements.
              </p>
          </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 pt-8 border-t border-gray-700"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-300'
            }`}>
              &copy; {new Date().getFullYear()} Zaitoon Ashraf IT Park. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm">
              <Link to="/privacy" className={`transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-300 hover:text-blue-300'
              }`}>
                Privacy Policy
              </Link>
              <Link to="/terms" className={`transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-300 hover:text-blue-300'
              }`}>
                Terms of Service
              </Link>
            </div>
        </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
