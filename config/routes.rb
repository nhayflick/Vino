Vino::Application.routes.draw do
  root to: "queries#index"
  resources :queries, only: [:index, :show, :create]
end
