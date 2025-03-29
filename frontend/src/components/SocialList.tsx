import React from "react";
import SocialCard from "./SocialCard";

interface SocialListProps {
  socials: {
    name: string;
    icon: string;
  }[];
  linkedAccounts: { [key: string]: boolean };
  onLink: (platform: string) => void;
  onUnlink: (platform: string) => void;
}

const SocialList: React.FC<SocialListProps> = ({
  socials,
  linkedAccounts,
  onLink,
  onUnlink,
}) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {socials.map((social, index) => (
        <SocialCard
          key={index}
          social={social}
          isLinked={linkedAccounts[social.name] || false}
          onLink={() => onLink(social.name)}
          onUnlink={() => onUnlink(social.name)}
        />
      ))}
    </section>
  );
};

export default SocialList;
