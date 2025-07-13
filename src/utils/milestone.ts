import { StarIcon, TrendingUpIcon, AwardIcon, GiftIcon, ArrowRightIcon, CheckCircleIcon } from 'lucide-react';

export const milestoneLabels: { [key: number]: string } = {
  0: 'Eco Beginner',
  20: 'Eco Explorer',
  40: 'Eco Achiever',
  60: 'Eco Motivator',
  80: 'Eco Leader',
  100: 'Green Enthusiast',
};

export const milestoneIcons: { [key: number]: any } = {
  0: StarIcon,
  20: TrendingUpIcon,
  40: AwardIcon,
  60: GiftIcon,
  80: ArrowRightIcon,
  100: CheckCircleIcon,
};

export const greenEnthusiastMilestones = [0, 20, 40, 60, 80, 100];

export function getCurrentMilestone(points: number): number {
  let current = 0;
  for (let milestone of greenEnthusiastMilestones) {
    if (points >= milestone) {
      current = milestone;
    } else {
      break;
    }
  }
  return current;
}
