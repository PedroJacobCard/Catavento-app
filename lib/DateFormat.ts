export const DF = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "full"
});

export const DFSimple = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short"
});

export const DFOnlyHour = new Intl.DateTimeFormat("pt-BR", {
  timeStyle: 'short'
});