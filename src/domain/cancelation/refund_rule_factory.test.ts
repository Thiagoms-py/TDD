import { FullRefund } from "./full_refund";
import { NoRefund } from "./no_refund copy";
import { PartialRefund } from "./partial_refund";
import { RefundRuleFactory } from "./refund_rule_factory";

describe("RefundRuleFactory", () => {
  it("deve retornar FullRefund quando a reserva for cancelada com mais de 7 dias de antecedência", () => {
    const rule = RefundRuleFactory.getRefundRule(8);
    expect(rule).toBeInstanceOf(FullRefund);
    expect(rule.calculateRefund(400)).toBe(0);
  });

  it("deve retornar PartialRefund quando a reserva for cancelada entre 1 e 7 dias de antecedência", () => {
    for (const days of [1, 4, 7]) {
      const rule = RefundRuleFactory.getRefundRule(days);
      expect(rule).toBeInstanceOf(PartialRefund);
      expect(rule.calculateRefund(400)).toBe(200);
    }
  });

  it("deve retornar NoRefund quando a reserva for cancelada com menos de 1 dia de antecedência", () => {
    for (const days of [0.5, 0, -1]) {
      const rule = RefundRuleFactory.getRefundRule(days);
      expect(rule).toBeInstanceOf(NoRefund);
      expect(rule.calculateRefund(400)).toBe(400);
    }
  });
});
