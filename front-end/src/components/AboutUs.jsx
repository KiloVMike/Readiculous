import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Globe2, Star, Mail, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";


const AboutUs = () => {
    const navigate = useNavigate(); 
    return (
        <section className="w-full bg-gradient-to-r from-blue-200 to-green-300 text-gray-800 py-16 px-6 md:px-16">
            <div className="max-w-6xl mx-auto">
                {/* Title & Tagline */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-5xl font-bold mb-4 text-gray-900">About Readiculous</h1>
                    <p className="text-2xl italic text-amber-600 bold">"Where Stories Begin And Never End"</p>
                </motion.div>

                {/* Core Sections */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12"
                >
                    {/* Description */}
                    <div className="space-y-6 text-lg leading-relaxed">
                        <p>
                            <strong>Readiculous</strong> is your gateway to the magical world of books. Whether you’re a
                            weekend reader or a voracious book lover, our platform is designed to celebrate the joy of reading.
                        </p>
                        <p>
                            We house a rich and diverse collection spanning genres, languages, and voices — giving everyone a story to fall in love with.
                        </p>
                        <p>
                            From personalized recommendations to smooth shopping experiences and quick deliveries, we bring convenience and creativity to your literary life.
                        </p>
                        <p>
                            But Readiculous isn’t just about books. It’s about readers — a community where thoughts are shared, opinions are valued, and new ideas are born.
                        </p>
                    </div>

                    {/* Animated Icon Highlights */}
                    <div className="grid grid-cols-2 gap-6">
                        <FeatureCard icon={<BookOpen size={32} />} title="Curated Books" text="Handpicked selections across every genre, for every reader." />
                        <FeatureCard icon={<Users size={32} />} title="Reader Community" text="Connect with fellow book lovers and exchange ideas." />
                        <FeatureCard icon={<Globe2 size={32} />} title="Global Stories" text="Voices from around the world, right at your fingertips." />
                        <FeatureCard icon={<Star size={32} />} title="User Experience" text="Fast, seamless, and personalized for your taste." />
                    </div>
                </motion.div>

                {/* Mission & Vision */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="mt-20 space-y-10"
                >
                    <div>
                        <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
                        <p className="text-lg">
                            To inspire a lifelong love for reading by making books more discoverable, accessible, and enjoyable for everyone.
                            We strive to be a source of inspiration, creativity, and community.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
                        <p className="text-lg">
                            A world where stories transcend borders and bring people together, where every individual can find their next
                            favorite book — and maybe, their next great idea.
                        </p>
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-20 text-center"
                >
                    <h3 className="text-2xl font-bold mb-4">Join the Readiculous Journey</h3>
                    <p className="text-lg max-w-3xl mx-auto mb-6">
                        Be part of a vibrant reading culture. Explore, engage, and share your voice. Let’s build a community
                        that lives and breathes stories — together.
                    </p>
                    <button
  onClick={() => navigate("/allbooks")} // ✅ Actual navigation on click
  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition duration-300"
>
  Start Exploring
</button>
                </motion.div>
                 {/* Contact Us */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-32 bg-white/60 backdrop-blur-md p-10 rounded-xl shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Mail size={24} className="text-amber-500" />
            Contact Us
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-lg">
            <div>
              <p><strong>Email:</strong> hello@readiculous.com</p>
              <p><strong>Phone:</strong> +91 98765 43210</p>
              <p><strong>Location:</strong> Smt. CHM college, Ulhasnagar, India</p>
            </div>
            <div>
              <p>We'd love to hear from you! Whether it’s feedback, partnership inquiries, or just a good book recommendation — reach out anytime.</p>
            </div>
          </div>
        </motion.div>

        {/* Social Media */}
        <div className="mt-12 flex justify-center gap-6 text-gray-700 text-4xl">
  {[
    { href: '#', icon: <Facebook />, label: 'Facebook', color: 'hover:text-blue-600' },
    { href: '#', icon: <Instagram />, label: 'Instagram', color: 'hover:text-pink-500' },
    { href: '#', icon: <Twitter />, label: 'Twitter', color: 'hover:text-sky-500' },
    { href: '#', icon: <Linkedin />, label: 'LinkedIn', color: 'hover:text-blue-800' },
  ].map(({ href, icon, label, color }, index) => (
    <a
      key={index}
      href={href}
      aria-label={label}
      className={`group relative p-3 rounded-full transition-all duration-300 bg-green-50 hover:bg-green-100 shadow-md ${color}`}
    >
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition duration-300">
        {label}
      </span>
      <div className="group-hover:scale-110 transition-transform duration-300">{icon}</div>
    </a>
  ))}
</div>

      </div>
            
        </section>
    );
};

const FeatureCard = ({ icon, title, text }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white/70 rounded-xl shadow-md p-6 text-center backdrop-blur-md"
    >
        <div className="mb-3 text-amber-600">{icon}</div>
        <h4 className="text-lg font-semibold mb-2">{title}</h4>
        <p className="text-sm text-gray-700">{text}</p>
    </motion.div>
);

export default AboutUs;
