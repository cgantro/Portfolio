import SlideFrame from "./SlideFrame";

export default function IntroSlide({ profile }) {
  return (
    <SlideFrame
      id="intro"
      sectionLabel="Intro"
      title={profile.mainTitle}
      subtitle={profile.subtitle}
      className="intro-slide"
    >
      <div className="intro-grid">
        <div className="intro-main-block">
          <p className="intro-owner">{profile.owner}</p>
          <p className="intro-focus">
            <strong>Focus</strong> {profile.focus}
          </p>
          <p className="intro-focus">
            <strong>Target Roles</strong> {profile.targetRoles.join(" / ")}
          </p>
        </div>

        <div className="intro-link-block">
          <a href={profile.links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.links.email}>Email</a>
        </div>
      </div>
    </SlideFrame>
  );
}
