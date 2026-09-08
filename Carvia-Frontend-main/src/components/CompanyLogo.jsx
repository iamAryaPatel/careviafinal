import { useState } from 'react';

export default function CompanyLogo({ logo, companyLogo, company, className = "company-stamp", style }) {
  const [hasError, setHasError] = useState(false);

  const srcCandidate = companyLogo || logo || '';
  
  const isUrl = typeof srcCandidate === 'string' && (
    srcCandidate.startsWith('http://') ||
    srcCandidate.startsWith('https://') ||
    srcCandidate.startsWith('data:image/') ||
    srcCandidate.startsWith('/')
  );

  const firstLetter = (company && typeof company === 'string' && company.trim())
    ? company.trim().charAt(0).toUpperCase()
    : 'C';

  const shortText = (!isUrl && typeof srcCandidate === 'string' && srcCandidate.length <= 4)
    ? srcCandidate
    : firstLetter;

  if (isUrl && !hasError) {
    return (
      <div className={className} style={{ overflow: 'hidden', padding: 0, ...style }}>
        <img
          src={srcCandidate}
          alt={`${company || 'Company'} logo`}
          onError={() => setHasError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 'inherit',
            display: 'block'
          }}
        />
      </div>
    );
  }

  return (
    <div className={className} style={{ overflow: 'hidden', ...style }}>
      {shortText}
    </div>
  );
}
