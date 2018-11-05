Rails.application.routes.draw do
  post "/", to: "accelerometer_data_points#create"

  resources :watches, only: [] do
    resource :chart_data_set, only: :show
  end

  root to: "charts#index"
end
