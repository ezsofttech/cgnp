'use client';

import React, { useEffect } from 'react';
import { Calendar, Award, Flag, Star, Home, BookOpen } from 'lucide-react';
import { motion, useAnimation, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const HistoryTimeline = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const milestones = [
    {
      year: '2012',
      icon: <Calendar className="h-6 w-6" />,
      chapter: 'CHAPTER ONE',
      title: 'Party Foundation',
      description: 'Officially formed on 26 November 2012 from the India Against Corruption movement. Arvind Kejriwal became the first national convenor with the broom as election symbol.',
      highlight: true,
      color: 'bg-blue-600'
    },
    {
      year: '2013',
      icon: <Flag className="h-6 w-6" />,
      chapter: 'CHAPTER TWO',
      title: 'First Delhi Government',
      description: 'Won 28 seats in Delhi Assembly elections, formed government with outside support. Implemented water subsidy and anti-corruption helpline before resigning after 49 days.',
      highlight: false,
      color: 'bg-green-500'
    },
    {
      year: '2015',
      icon: <Award className="h-6 w-6" />,
      chapter: 'CHAPTER THREE',
      title: 'Historic Delhi Victory',
      description: 'Won 67 of 70 seats in Delhi Assembly elections. Launched Mohalla Clinics, transformed government schools, and provided free water and electricity subsidies.',
      highlight: false,
      color: 'bg-yellow-500'
    },
    {
      year: '2020',
      icon: <Star className="h-6 w-6" />,
      chapter: 'CHAPTER FOUR',
      title: 'Delhi Re-election',
      description: 'Secured 62 seats in Delhi Assembly elections, validating governance model. Expanded education reforms and installed CCTV cameras for women\'s safety.',
      highlight: false,
      color: 'bg-purple-500'
    },
    {
      year: '2022',
      icon: <Home className="h-6 w-6" />,
      chapter: 'CHAPTER FIVE',
      title: 'Punjab Government',
      description: 'Won 92 seats in Punjab Assembly elections. Bhagwant Mann became CM, marking first AAP government outside Delhi with focus on anti-corruption.',
      highlight: true,
      color: 'bg-red-500'
    },
    {
      year: '2023',
      icon: <Award className="h-6 w-6" />,
      chapter: 'CHAPTER SIX',
      title: 'National Expansion',
      description: 'Contested elections in multiple states, emerging as national alternative. Focused on grassroots campaigns and governance models from Delhi and Punjab.',
      highlight: false,
      color: 'bg-indigo-500'
    },
    {
      year: '2024',
      icon: <Star className="h-6 w-6" />,
      chapter: 'CHAPTER SEVEN',
      title: 'Lok Sabha Performance',
      description: 'Improved national vote share in General Elections. Won seats in Punjab and made significant gains in other states, establishing pan-India presence.',
      highlight: true,
      color: 'bg-pink-500'
    }
  ];

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  const lineVariants: Variants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Aam Aadmi Party
            </span> Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A timeline of our milestones and achievements since inception
          </p>
        </motion.div>

        <div ref={ref} className="relative">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={lineVariants}
            style={{ originY: 0 }}
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 z-0 transform -translate-x-1/2"
          />

          <div className="space-y-16 relative z-10">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate={controls}
                variants={itemVariants}
                className={`relative flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}
              >
                <div className="flex flex-col items-center w-24 flex-shrink-0">
                  <div className={`w-14 h-14 rounded-full ${milestone.color} flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform`}>
                    {milestone.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-700 mt-3">{milestone.year}</div>
                </div>

                <div className={`flex-1 rounded-2xl p-8 relative overflow-hidden ${
                  milestone.highlight 
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 shadow-lg' 
                    : 'bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow'
                }`}>
                  {milestone.highlight && (
                    <div className="absolute top-0 right-0 px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-bl-lg">
                      HIGHLIGHT
                    </div>
                  )}
                  <div className="text-sm font-semibold text-blue-600 mb-2 tracking-wider">
                    {milestone.chapter}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{milestone.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{milestone.description}</p>
                  
                  <div className={`absolute bottom-0 left-0 h-1 w-full ${
                    milestone.highlight ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gray-200'
                  }`} />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2 }}
            className="pt-16 text-center text-gray-500"
          >
            <div className="inline-flex items-center bg-white px-6 py-3 rounded-full shadow-sm">
              <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
              <em className="text-sm">Historical records from official party archives</em>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HistoryTimeline;
