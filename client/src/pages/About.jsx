import { useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform, useScroll } from 'framer-motion';
import { Users, Award, Globe, Heart, Mountain, Shield, Compass, Star, MapPin } from 'lucide-react';

/* ---- Animation Variants ---- */
const reveal = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

/* ---- Animated Counter ---- */
const AnimatedCounter = ({ value, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const spring = useSpring(0, { stiffness: 30, damping: 15 });
  const display = useTransform(spring, (v) => {
    if (value >= 10000) return `${(Math.round(v / 1000))}K${suffix}`;
    return `${Math.round(v)}${suffix}`;
  });

  if (isInView && spring.get() === 0) spring.set(value);

  return (
    <motion.span ref={ref} className="tabular-nums">
      {display}
    </motion.span>
  );
};

/* ---- Data ---- */
const stats = [
  { value: 15, suffix: '+', label: 'Years Experience' },
  { value: 10000, suffix: '+', label: 'Happy Travelers' },
  { value: 200, suffix: '+', label: 'Tour Packages' },
  { value: 50, suffix: '+', label: 'Destinations' },
];

const team = [
  { name: 'Arjun Singh', role: 'Founder & CEO', bio: '15+ years in travel industry', gradient: 'from-primary-400 to-primary-600', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop' },
  { name: 'Priya Mehta', role: 'Head of Operations', bio: 'Expert in logistics & planning', gradient: 'from-secondary-400 to-secondary-600', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop' },
  { name: 'Rahul Verma', role: 'Lead Tour Guide', bio: 'Certified mountain guide & naturalist', gradient: 'from-accent-400 to-accent-600', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop' },
  { name: 'Sneha Kapoor', role: 'Customer Success', bio: 'Dedicated to traveler satisfaction', gradient: 'from-rose-400 to-rose-600', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop' },
];

const values = [
  { icon: Heart, title: 'Passion for Travel', desc: 'We believe every journey should be a memorable experience that transforms the way you see the world and connects you with India\'s rich heritage.' },
  { icon: Shield, title: 'Safety First', desc: 'Your safety and comfort are our top priorities. Every tour includes verified accommodations, trained guides, and 24/7 emergency support.' },
  { icon: Globe, title: 'Sustainable Tourism', desc: 'We promote responsible travel that respects local communities, preserves natural beauty, and minimizes environmental impact.' },
  { icon: Award, title: 'Excellence', desc: 'From itinerary planning to on-ground execution, we strive for excellence in every detail of our service delivery.' },
];

const milestones = [
  { year: '2010', event: 'Founded in Rishikesh as a small Chardham Yatra specialist' },
  { year: '2014', event: 'Expanded to hill stations and heritage tours across North India' },
  { year: '2018', event: 'Crossed 5,000 happy travelers milestone, launched South India packages' },
  { year: '2022', event: 'Recognized as one of India\'s top 50 pilgrimage tour operators' },
  { year: '2025', event: '200+ packages, 50+ destinations, and 10,000+ travelers served' },
];

const About = () => {
  const storyRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ['start end', 'end start'] });
  const storyImgY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <div className="bg-surface-dim relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 grain pointer-events-none z-0" />
      <div className="absolute top-40 right-[10%] w-[500px] h-[500px] rounded-full bg-primary-100/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 left-[5%] w-[400px] h-[400px] rounded-full bg-accent-100/15 blur-[100px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Hero */}
        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="pt-32 mb-20"
        >
          <motion.div variants={reveal} className="flex items-center gap-3 mb-6">
            <motion.div animate={{ width: [0, 48] }} transition={{ duration: 0.8, delay: 0.3 }} className="h-[2px] bg-primary-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">Our Story</span>
          </motion.div>

          <motion.h1 variants={reveal} className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-heading leading-[0.95] mb-6">
            About <span className="italic font-normal text-gradient-warm">WanderNest</span>
          </motion.h1>

          <motion.p variants={reveal} className="text-gray-400 text-lg max-w-xl leading-relaxed font-light">
            A passionate team of travel enthusiasts dedicated to crafting unforgettable journeys
            across India's most sacred and beautiful destinations since 2010.
          </motion.p>
        </motion.div>

        {/* Story Section with Parallax */}
        <motion.div
          ref={storyRef}
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="grid md:grid-cols-2 gap-12 items-center mb-24"
        >
          <motion.div style={{ y: storyImgY }} variants={scaleIn} className="relative h-[400px] rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2B3A52] via-primary-900 to-secondary-700" />
            <img
              src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&h=800&fit=crop"
              alt="WanderNest Team"
              className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.07]">
              <Mountain className="w-48 h-48 text-white" />
            </div>
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-white/30 text-xs uppercase tracking-[0.2em] mb-2">Est.</p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="text-white font-heading text-5xl font-bold"
              >
                2010
              </motion.p>
            </div>
          </motion.div>

          <motion.div variants={reveal} className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-heading">
              From a small office in Rishikesh<br />
              <span className="italic font-normal text-gradient-warm">to India's trusted travel partner</span>
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Founded in 2010, WanderNest began with a simple mission: to make the sacred Chardham Yatra
              accessible to every devotee with comfort, safety, and authentic spiritual experiences.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Over the years, we have expanded to cover hill stations, heritage sites, adventure destinations,
              and spiritual retreats across India. Today, we are proud to be one of the most trusted tour
              operators, serving over 10,000 happy travelers annually.
            </p>

            {/* Timeline milestones */}
            <div className="space-y-3 pt-4">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <span className="text-xs font-bold text-primary-500 mt-1 w-10 shrink-0">{m.year}</span>
                  <p className="text-sm text-gray-500">{m.event}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {team.map((t, i) => (
                  <motion.div
                    key={t.name}
                    whileHover={{ y: -4, zIndex: 10 }}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-xs font-bold overflow-hidden"
                  >
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                <span className="font-semibold text-heading">50+</span> team members
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="mb-24"
        >
          <div className="bg-[#2B3A52] rounded-[2rem] p-10 md:p-16 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary-500/10 blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-accent-500/10 blur-[60px]" />

            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-10">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={reveal}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <p className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/30">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="mb-24"
        >
          <motion.div variants={reveal} className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-500 mb-4">What Drives Us</p>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-heading">
              Our <span className="italic font-normal text-gradient-warm">values</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={reveal}
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary-200 transition-all duration-500"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center mb-6 group-hover:from-primary-100 group-hover:to-accent-100 transition-all duration-500"
                >
                  <v.icon className="w-7 h-7 text-primary-600" />
                </motion.div>
                <h3 className="font-heading font-bold text-lg text-heading mb-3">{v.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="pb-24"
        >
          <motion.div variants={reveal} className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-500 mb-4">The People Behind</p>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-heading">
              Meet our <span className="italic font-normal text-gradient-warm">team</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={scaleIn}
                whileHover={{ y: -10 }}
                className="group text-center"
              >
                <div className={`relative w-40 h-40 rounded-3xl bg-gradient-to-br ${member.gradient} mx-auto mb-5 overflow-hidden`}>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-90 transition-opacity duration-500"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-500">
                    <Users className="w-16 h-16 text-white/30" />
                  </div>
                </div>
                <h3 className="font-heading font-bold text-lg text-heading">{member.name}</h3>
                <p className="text-sm text-primary-500 font-medium mt-1">{member.role}</p>
                <p className="text-xs text-gray-400 mt-1">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
