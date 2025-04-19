import { useCallback, useState } from "react";

function useTerm() {
  const [agreeOrNotAllTerm, setAgreeOrNotAllTerm] = useState(false);                        // 약관 전체 동의
  const [agreeOrNotServiceTerm, setAgreeOrNotServiceTerm] = useState(false);                // 서비스 이용 약관 동의
  const [agreeOrNotPrivacyTerm, setAgreeOrNotPrivacyTerm] = useState(false);                // 개인정보 처리 방침 동의
  const [agreeOrNotEmailMarketingTerm, setAgreeOrNotEmailMarketingTerm] = useState(false);  // 이메일 마케팅 수신 동의

  // 약관 전체 동의 클릭 시, 나머지 약관 동의 체크박스도 모두 체크/해제
  const toggleAllTerms = useCallback(() => {
    const newValue = !agreeOrNotAllTerm;
    setAgreeOrNotAllTerm(newValue);
    setAgreeOrNotServiceTerm(newValue);
    setAgreeOrNotPrivacyTerm(newValue);
    setAgreeOrNotEmailMarketingTerm(newValue);
  }, [agreeOrNotAllTerm]);

  // 서비스 이용 약관 동의 체크박스 클릭
  const toggleServiceTerm = useCallback(() => {
    const newValue = !agreeOrNotServiceTerm;
    setAgreeOrNotServiceTerm(newValue);
    setAgreeOrNotAllTerm(newValue && agreeOrNotPrivacyTerm && agreeOrNotEmailMarketingTerm);
  }, [agreeOrNotServiceTerm, agreeOrNotPrivacyTerm, agreeOrNotEmailMarketingTerm]);

  // 개인정보 처리 방침 동의 체크박스 클릭
  const togglePrivacyTerm = useCallback(() => {
    const newValue = !agreeOrNotPrivacyTerm;
    setAgreeOrNotPrivacyTerm(newValue);
    setAgreeOrNotAllTerm(newValue && agreeOrNotServiceTerm && agreeOrNotEmailMarketingTerm);
  }, [agreeOrNotPrivacyTerm, agreeOrNotServiceTerm, agreeOrNotEmailMarketingTerm]);

  // 이메일 마케팅 수신 동의 체크박스 클릭
  const toggleEmailMarketingTerm = useCallback(() => {
    const newValue = !agreeOrNotEmailMarketingTerm;
    setAgreeOrNotEmailMarketingTerm(newValue);
    setAgreeOrNotAllTerm(newValue && agreeOrNotServiceTerm && agreeOrNotPrivacyTerm);
  }, [agreeOrNotEmailMarketingTerm, agreeOrNotServiceTerm, agreeOrNotPrivacyTerm]);

  return {
    agreeOrNotAllTerm,
    agreeOrNotServiceTerm,
    agreeOrNotPrivacyTerm,
    agreeOrNotEmailMarketingTerm,
    toggleAllTerms,
    toggleServiceTerm,
    togglePrivacyTerm,
    toggleEmailMarketingTerm,
  };
}

export default useTerm;