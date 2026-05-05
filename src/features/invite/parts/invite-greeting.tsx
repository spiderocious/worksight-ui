interface Props {
  candidateName: string;
  reviewerName: string;
}

export const InviteGreeting = ({ candidateName, reviewerName }: Props) => {
  const firstName = candidateName.split(' ')[0];
  return (
    <section>
      <p className="text-xs uppercase tracking-[0.18em] text-brand-700 font-medium mb-3">
        Personal invite
      </p>
      <h1 className="font-display text-4xl lg:text-5xl tracking-tight leading-[1.1] text-ink">
        Hi {firstName}, welcome to WorkSight.
      </h1>
      <p className="text-base text-ink-muted mt-4 leading-relaxed max-w-xl">
        Your reviewer{' '}
        <span className="text-ink font-medium">{reviewerName}</span> has invited you to
        complete a take-home assessment. Follow the three steps below to install the app,
        sign in, and start your session.
      </p>
    </section>
  );
};
